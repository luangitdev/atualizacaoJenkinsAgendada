from flask import Flask, request, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime
import requests
from models import db, ScheduledJob, JobHistory
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scheduler.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

# Enable CORS
CORS(app)

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.start()

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = ScheduledJob.query.order_by(ScheduledJob.created_at.desc()).all()
    return jsonify([job.to_dict() for job in jobs])

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = ScheduledJob.query.get_or_404(job_id)
    return jsonify(job.to_dict())

@app.route('/api/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['app_name', 'version', 'target_server', 'app_branch', 
                      'schedule_date', 'schedule_time', 'jenkins_url', 
                      'jenkins_user', 'jenkins_token']
    
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Create new job
    job = ScheduledJob(
        app_name=data['app_name'],
        version=data['version'],
        target_server=data['target_server'],
        app_branch=data['app_branch'],
        skip_clone=data.get('skip_clone', True),
        skip_build=data.get('skip_build', False),
        schedule_date=data['schedule_date'],
        schedule_time=data['schedule_time'],
        jenkins_url=data['jenkins_url'],
        jenkins_user=data['jenkins_user'],
        jenkins_token=data['jenkins_token'],
        status='pending'
    )
    
    db.session.add(job)
    db.session.commit()
    
    # Schedule the job
    schedule_jenkins_job(job)
    
    return jsonify({
        'message': 'Job scheduled successfully',
        'job_id': job.id
    }), 201

@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    job = ScheduledJob.query.get_or_404(job_id)
    data = request.get_json()
    
    # Update fields
    for field in ['app_name', 'version', 'target_server', 'app_branch', 
                 'skip_clone', 'skip_build', 'schedule_date', 'schedule_time',
                 'jenkins_url', 'jenkins_user', 'jenkins_token', 'status']:
        if field in data:
            setattr(job, field, data[field])
    
    job.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Job updated successfully'})

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = ScheduledJob.query.get_or_404(job_id)
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({'message': 'Job deleted successfully'})

def schedule_jenkins_job(job):
    """Schedule a Jenkins job execution"""
    schedule_datetime = datetime.strptime(
        f"{job.schedule_date} {job.schedule_time}", 
        "%Y-%m-%d %H:%M"
    )
    
    # Schedule the job
    scheduler.add_job(
        execute_jenkins_job,
        DateTrigger(run_date=schedule_datetime),
        args=[job.id],
        id=f"jenkins_job_{job.id}"
    )
    
    print(f"Job {job.id} scheduled for execution at {schedule_datetime}")

def execute_jenkins_job(job_id):
    """Execute the Jenkins API call"""
    job = ScheduledJob.query.get(job_id)
    if not job:
        print(f"Job {job_id} not found")
        return
    
    try:
        # Prepare request data
        data = {
            'VERSION': job.version,
            'APP_NAME': job.app_name,
            'SKIP_CLONE': str(job.skip_clone).lower(),
            'SKIP_BUILD': str(job.skip_build).lower(),
            'TARGET_SERVER': job.target_server,
            'APP_BRANCH': job.app_branch
        }
        
        # Make Jenkins API call
        response = requests.post(
            f"{job.jenkins_url}/job/PTF-ROUTING-LUAN/buildWithParameters?delay=0sec",
            data=data,
            auth=(job.jenkins_user, job.jenkins_token)
        )
        
        response.raise_for_status()
        
        # Update job status
        job.status = 'completed'
        
        # Log execution history
        history = JobHistory(
            job_id=job.id,
            status='success',
            response_text=response.text
        )
        db.session.add(history)
        
        print(f"Jenkins job executed successfully for {job.app_name}")
        
    except Exception as e:
        # Update job status to failed
        job.status = 'failed'
        
        # Log error in history
        history = JobHistory(
            job_id=job.id,
            status='failed',
            response_text=str(e)
        )
        db.session.add(history)
        
        print(f"Error executing Jenkins job: {e}")
    
    finally:
        job.updated_at = datetime.utcnow()
        db.session.commit()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
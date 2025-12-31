import os

class Config():
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://neondb_owner:npg_HgV5LbqMDI2j@ep-blue-meadow-a4vw3sv8-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'SECRETKEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
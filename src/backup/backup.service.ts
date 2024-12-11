


//rough draft
//still not connected to the db for backing up
//find out who will backup and when to backup (connection string)

//ADD DOTENV FILE


import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  @Cron('0 0 * * *') // Backs up at 12:00 AM daily
  async handleBackup() {
    try {
      const backupDir = path.resolve(__dirname, '../backups');
      const date = new Date().toISOString().split('T')[0];

      // Ensure the backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Use environment variables for sensitive information
      const dbUri = process.env.MONGODB_URI;
      if (!dbUri) {
        throw new Error('MONGODB_URI environment variable is not set');
      }

      const command = `mongodump --uri="${dbUri}" --out=${backupDir}/${date}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Backup failed: ${error.message}`);
          this.logger.error(stderr);
        } else {
          this.logger.log(`Backup completed: ${stdout}`);
        }
      });
    } catch (error) {
      this.logger.error(`Backup process encountered an error: ${error.message}`);
    }
  }
}

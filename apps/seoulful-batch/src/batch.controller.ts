import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');

  constructor(private readonly batchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('BATCH SERVER READY!');
	}

// (Sekund) (Minut) (Soat) (Kun/sana) (Oy) (Hafta kuni)
	@Cron('00 00 01 31 12 4', { name: BATCH_ROLLBACK })
	public async batchRollback() {
	try {
		this.logger['context'] = BATCH_ROLLBACK;
		this.logger.debug('EXECUTED!');
		await this.batchService.batchRollback();
	} catch (err) {
		this.logger.error(err);
	}
	}

	@Cron('00 59 * * * *', { name: BATCH_TOP_PROPERTIES })
	public async batchTopProperties() {
	try {
		this.logger['context'] = BATCH_TOP_PROPERTIES;
		this.logger.debug('EXECUTED!');
		await this.batchService.batchTopProperties();
	} catch (err) {
		this.logger.error(err);
	}
	}

	@Cron('20 59 * * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
	try {
		this.logger['context'] = BATCH_TOP_AGENTS;
		this.logger.debug('EXECUTED!');
		await this.batchService.batchTopAgents();
	} catch (err) {
		this.logger.error(err);
	}
	}

  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}

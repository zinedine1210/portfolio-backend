import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class ConnectionService {
    getName(): string {
        return 'null';
    }
}

@Injectable()
export class MySQLConnection extends ConnectionService {
    getName(): string {
        return 'Use MySQL';
    }
}

@Injectable()
export class MongoDBConnection extends ConnectionService {
    getName(): string {
        return 'User MongoDB';
    }
}

export function createConnection(configService: ConfigService): ConnectionService {
    if(configService.get('DATABASE') == 'mysql'){
        return new MySQLConnection();
    }else{
        return new MongoDBConnection();
    }
}
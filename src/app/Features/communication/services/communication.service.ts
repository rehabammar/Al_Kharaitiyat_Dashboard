import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api-service.service';
import { User } from '../../auth/models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { ApiEndpoints } from '../../../core/constants/api-endpoints';
import { map } from 'rxjs/internal/operators/map';
import { ApiPage } from '../../../core/models/api.page.interface';
import { WhatsAppMessage } from '../models/whatsapp-message.model';

@Injectable({ providedIn: 'root' })
export class CommunicationService {

    API_URL = "http://84.46.242.148:3001/message/sendText/alkharaitiyat";

    constructor(private http: HttpClient, private api: ApiService) { }



    getUsers(page: number = 0, size: number = 20): Observable<ApiPage<User>> {
        return this.api
            .post<ApiPage<User>>(
                ApiEndpoints.getUsersList(),
                {
                    "page": page,
                    "size": size,
                    "sort": [{ "property": "userPk", "direction": "desc" }]
                }
            )
            .pipe(map(res => res.data));
    }

    getUsersWithSearch(body: any) {
        return this.api.post<ApiPage<User>>(
            ApiEndpoints.getUsersList(),
            body
        ).pipe(map(res => res.data));
    }





    sendBroadcast(payload: any) {
        return this.api.post(
            ApiEndpoints.sendWatsappMessages(),
            payload,
            {
                headers: {
                    'apikey': 'MyStrongApiKey_753753',
                    'Content-Type': 'application/json'
                }
            }
        );
    }


    getWatsappMessages(page: number = 0, size: number = 20, userFk: number): Observable<ApiPage<WhatsAppMessage>> {
        return this.api
            .post<ApiPage<WhatsAppMessage>>(
                ApiEndpoints.getWatsappMessages(),
                {
                    "page": page,
                    "size": size,
                    "userFk": userFk,
                    "sort": [{ "property": "messagePk", "direction": "Asc" }]

                }
            )
            .pipe(map(res => res.data));
    }

}

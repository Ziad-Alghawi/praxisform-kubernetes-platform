import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubmissionCreateRequest } from './submission-create.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PublicSubmissionsService {
  private baseUrl = environment.apiUrl; // z.B. http://localhost:8080

  constructor(private http: HttpClient) {}

  createSubmission(payload: SubmissionCreateRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/api/submissions`, payload);
  }
}

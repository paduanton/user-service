import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  private userAPIBaseURL = process.env.USER_API_BASE_URL;

  constructor(private http: HttpService) {}

  getUsers() {
    return this.http
      .get(`${this.userAPIBaseURL}/users`)
      .pipe(map((response) => response.data));
  }

  getUser(id): Observable<{
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }> {
    return this.http
      .get(`${this.userAPIBaseURL}/users/${id}`)
      .pipe(map((response) => response.data.data));
  }
}

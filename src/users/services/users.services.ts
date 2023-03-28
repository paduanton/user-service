import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {
  private userAPIBaseURL = process.env.USER_API_BASE_URL;

  constructor(private http: HttpService) {}

  getUsers() {
    return this.http
      .get(`${this.userAPIBaseURL}/users`)
      .pipe(map((response) => response.data));
  }

  getUser(id) {
    return this.http
      .get(`${this.userAPIBaseURL}/users/${id}`)
      .pipe(map((response) => response.data.data));
  }
}

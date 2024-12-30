import { Request } from "express";

export interface IMovie {
  id?: number;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
}

export interface TempMovie {
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  genre_ids: number[];
}

export interface IRequestWithUserId extends Request {
  userId?: number;
}

export interface QueryParams {
  title?: string;
  release_date?: string; // String in "YYYY-MM-DD" format
}

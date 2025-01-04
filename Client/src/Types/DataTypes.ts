export interface IUser {
  _id: number;
  username: string;
  email: string;
  profile_pic_url: string;
  token: string;
}

export interface IMovie {
  id: number;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  genre_ids: number[];
}

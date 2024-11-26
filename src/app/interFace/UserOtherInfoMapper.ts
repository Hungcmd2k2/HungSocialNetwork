import { UserProfileOther } from "./UserOtherInfo";

export const mapUserProfile = (response: any): UserProfileOther => {
  return {
    userid :response.userid,
    username: response.username,
    email:response.email,
    fullname: response.fullname,
    avatar: response.avatar,
    coverphoto: response.coverphoto,
    dob: response.dob,
    linksocial: response.linksocial,
    lovesong: response.lovesong,
    education: response.education,
    address: response.address,
  };
};

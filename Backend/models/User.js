import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // 이메일도 유니크
    },
    password: {
      type: String,
      required: function () {
        return !this.kakaoId;
      },
    },
    kakaoId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profileImage: String,
  },
  { timestamps: true }
);

export const User = model('User', userSchema);

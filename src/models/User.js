import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { 
    type: String, 
    unique:[true, "Email is exists"],
    required: [true, "Email is required"],
   },
  name: { 
    type: String, 
    required: [true, "Name is required"]
  },
  image:{type: String},
  role:{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }
});

const User = models?.User || model("User", UserSchema);
export default User;
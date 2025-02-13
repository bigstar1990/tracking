"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ✅ Register a new user (store raw password)
interface RegisterValues {
  email: string;
  raw: string;
  name: string;
  role: string;
}

export const register = async (values: RegisterValues) => {
  const { email, raw, name, role } = values;
  debugger;

  try {
    await connectDB();
    const userFound = await User.findOne({ email });

    if (userFound) {
      return { error: "Email already exists!" };
    }
    const hashedPassword = await bcrypt.hash(raw, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      raw,
      role,
    });

    const savedUser = await user.save();
    return {
      success: "User registered successfully",
      user: {
        _id: savedUser._id.toString(), // Convert ObjectId to string
        name: savedUser.name,
        email: savedUser.email,
        password: savedUser.password,
        raw: savedUser.raw,
        role: savedUser.role,
      },
    };
  } catch (error) {
    console.log(error);
    return { error: "Registration failed" };
  }
};

// ✅ Modify an existing user (update password & role)
export const modifyUser = async (id: string, values: RegisterValues) => {
  debugger;
  const { name, email, raw, role } = values;
  try {
    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return { error: "User not found" };
    }

    if (raw) {
      user.raw = raw;
      user.password = await bcrypt.hash(raw, 10); // Update plain password
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();

    return {
      success: "User updated successfully",
      user: {
        _id: updatedUser._id.toString(), // Convert ObjectId to string
        name: updatedUser.name,
        email: updatedUser.email,
        password: updatedUser.password,
        raw: updatedUser.raw,
        role: updatedUser.role,
      },
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to update user" };
  }
};

// ✅ Remove a user
export const removeUser = async (id: string) => {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return { error: "User not found" };
    }

    return { success: "User removed successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Failed to remove user" };
  }
};

// ✅ Fetch all users
export const getUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({});

    return {
      users: users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        raw: user.raw, // Send plain password to frontend
        role: user.role,
      })),
    };
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch users" };
  }
};

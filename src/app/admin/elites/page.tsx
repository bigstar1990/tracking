"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getUsers, register, modifyUser, removeUser } from "@/actions/user"; // Updated import path
import { UserDocument } from "@/models/User";

const { Option } = Select;

export default function Elites() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<
    UserDocument | Partial<UserDocument> | null
  >(null);
  const [form] = Form.useForm();
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user.role !== "Admin") {
      router.push("/");
    } else loadUsers();
  }, [status, router, session]);

  // ✅ Load users from MongoDB
  const loadUsers = async () => {
    const response = await getUsers();
    if (response.users) {
      setUsers(response.users as UserDocument[]);
    } else {
      message.error("Failed to fetch users");
    }
  };

  // ✅ Open modal for adding/editing user
  const showModal = (user: Partial<UserDocument> | null = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    form.setFieldsValue(
      user || { name: "", email: "", raw: "", role: "Moderator" }
    );
  };

  // ✅ Close modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // ✅ Handle form submission (Add/Edit)
  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (editingUser) {
      const response = await modifyUser(editingUser._id as string, values);
      if (response.success) {
        message.success(response.success);
        loadUsers();
      } else {
        message.error(response.error);
      }
    } else {
      debugger;
      const response = await register(values);
      if (response.success) {
        message.success(response.success);
        loadUsers();
      } else {
        message.error(response.error);
      }
    }

    handleCancel();
  };

  // ✅ Handle delete user
  const handleDelete = async (id: string) => {
    const response = await removeUser(id);
    if (response.success) {
      message.success(response.success);
      loadUsers();
    } else {
      message.error(response.error);
    }
  };

  // ✅ Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "raw", // Use raw password field
      key: "raw",
      render: (_: unknown, record: UserDocument) => (
        <Space>
          <span>{visiblePasswords[record._id] ? record.raw : "******"}</span>
          <Button
            icon={
              visiblePasswords[record._id] ? (
                <EyeInvisibleOutlined />
              ) : (
                <EyeOutlined />
              )
            }
            onMouseDown={() => togglePasswordVisibility(record._id)}
            onMouseUp={() => togglePasswordVisibility(record._id)}
          />
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: UserDocument) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-[80svh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Elites Page</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add More
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      {/* ✅ Modal for adding/editing user */}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="raw" label="Password">
            <Input.Password placeholder="Enter password (leave empty to keep current password)" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Role is required" }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Moderator">Moderator</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

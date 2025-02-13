"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Table, Button, message, Space, Modal, Input, InputRef } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getShipments,
  registerShipment,
  modifyShipment,
  removeShipment,
} from "@/actions/shipment";
import { IShipmentProps } from "@/models/Shipment";
import ShipmentEditModal from "@/components/ShipmentEditModal";
import ShipmentDetails from "@/components/ShipmentDetails";
import { ObjectId } from "mongoose";

export default function Shipments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shipments, setShipments] = useState<IShipmentProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<IShipmentProps | null>(
    null
  );
  const [viewingShipment, setViewingShipment] = useState<IShipmentProps | null>(
    null
  );
  const searchTextRef = useRef<InputRef | null>(null);
  const searchEmailRef = useRef<InputRef | null>(null);
  const searchNameRef = useRef<InputRef | null>(null);
  const searchOrderIdRef = useRef<InputRef | null>(null);
  const searchCampaignIdRef = useRef<InputRef | null>(null);
  const searchCampaignNameRef = useRef<InputRef | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalShipments, setTotalShipments] = useState(0);

  const loadShipments = async (
    page = 1,
    limit = 10,
    search = "",
    email = "",
    name = "",
    orderId = "",
    campaignId = "",
    campaignName = ""
  ) => {
    const response = await getShipments(
      page,
      limit,
      search,
      email,
      name,
      orderId,
      campaignId,
      campaignName
    );
    if (response.shipments) {
      setShipments(response.shipments);
      setTotalShipments(response.total);
      setCurrentPage(response.page);
      setPageSize(response.limit);
    } else {
      message.error("Failed to fetch shipments");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else {
      loadShipments(
        1,
        10,
        searchTextRef.current?.input?.value || "",
        searchEmailRef.current?.input?.value || "",
        searchNameRef.current?.input?.value || "",
        searchOrderIdRef.current?.input?.value || "",
        searchCampaignIdRef.current?.input?.value || "",
        searchCampaignNameRef.current?.input?.value || ""
      );
    }
  }, [status, router]);

  const showModal = (shipment: IShipmentProps | null = null) => {
    setEditingShipment(shipment);
    setIsModalOpen(true);
  };

  const showViewModal = (shipment: IShipmentProps) => {
    setViewingShipment(shipment);
    setIsViewModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleSubmit = async (values: IShipmentProps) => {
    if (editingShipment) {
      const response = await modifyShipment(editingShipment._id, values);
      if (response.success) {
        message.success(response.success);
        loadShipments();
      } else {
        message.error(response.error);
      }
    } else {
      const response = await registerShipment(values);
      if (response.success) {
        message.success(response.success);
        loadShipments();
      } else {
        message.error(response.error);
      }
    }
    handleCancel();
  };

  const handleDelete = async (id: ObjectId) => {
    const response = await removeShipment(id);
    if (response.success) {
      message.success(response.success);
      loadShipments();
    } else {
      message.error(response.error);
    }
  };

  const handleTableChange = (page: number, pageSize: number) => {
    loadShipments(
      page,
      pageSize,
      searchTextRef.current?.input?.value || "",
      searchEmailRef.current?.input?.value || "",
      searchNameRef.current?.input?.value || "",
      searchOrderIdRef.current?.input?.value || "",
      searchCampaignIdRef.current?.input?.value || "",
      searchCampaignNameRef.current?.input?.value || ""
    );
  };

  const handleSearchClicked = () => {
    loadShipments(
      1,
      pageSize,
      searchTextRef.current?.input?.value || "",
      searchEmailRef.current?.input?.value || "",
      searchNameRef.current?.input?.value || "",
      searchOrderIdRef.current?.input?.value || "",
      searchCampaignIdRef.current?.input?.value || "",
      searchCampaignNameRef.current?.input?.value || ""
    );
  };

  const columns = [
    {
      title: (
        <div>
          Waybill Number
          <Input
            placeholder="Search Waybill Number"
            ref={searchTextRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: "waybillNumber",
      key: "waybillNumber",
    },
    {
      title: (
        <div>
          Order Id
          <Input
            placeholder="Search Order Id"
            ref={searchOrderIdRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Order Created At",
      dataIndex: "orderCreatedAt",
      key: "orderCreatedAt",
      render: (orderCreatedAt: IShipmentProps["orderCreatedAt"]) =>
        new Date(orderCreatedAt).toLocaleString(),
    },
    {
      title: (
        <div>
          Campaign Id
          <Input
            placeholder="Search Campaign Id"
            ref={searchCampaignIdRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: ["order", "campaignId"],
      key: "campaignId",
    },
    {
      title: (
        <div>
          Campaign Name
          <Input
            placeholder="Search Campaign Name"
            ref={searchCampaignNameRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: ["order", "campaignName"],
      key: "campaignName",
    },
    {
      title: (
        <div>
          Customer Name
          <Input
            placeholder="Search Customer Name"
            ref={searchNameRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: "customer",
      key: "customerName",
      render: (customer: IShipmentProps["customer"]) =>
        `${customer.firstname} ${customer.lastname}`,
    },
    {
      title: (
        <div>
          Customer Email
          <Input
            placeholder="Search Customer Email"
            ref={searchEmailRef}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      dataIndex: ["customer", "email"],
      key: "customerEmail",
    },
    {
      title: (
        <div className="flex flex-col gap-2">
          Actions
          <Button
            icon={<SearchOutlined />}
            onClick={() => handleSearchClicked()}
          >
            Search
          </Button>
        </div>
      ),
      key: "actions",
      render: (_: unknown, record: IShipmentProps) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showViewModal(record)}>
            View
          </Button>
          {session?.user.role === "Admin" && (
            <>
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
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-[80svh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl">Shipments Page</h1>
        {session?.user.role === "Admin" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add Shipment
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={shipments}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalShipments,
          onChange: handleTableChange,
        }}
      />

      <ShipmentEditModal
        isModalOpen={isModalOpen}
        editingShipment={editingShipment}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      />

      {viewingShipment && (
        <Modal
          title="Shipment Details"
          open={isViewModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <ShipmentDetails waybillNumber={viewingShipment.waybillNumber} />
        </Modal>
      )}
    </div>
  );
}

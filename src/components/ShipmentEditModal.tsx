import { Modal, Form, Input } from "antd";
import { IShipmentProps } from "@/models/Shipment";

interface ShipmentEditModalProps {
  isModalOpen: boolean;
  editingShipment: IShipmentProps | null;
  handleCancel: () => void;
  handleSubmit: (values: IShipmentProps) => void;
}

const ShipmentEditModal: React.FC<ShipmentEditModalProps> = ({
  isModalOpen,
  editingShipment,
  handleCancel,
  handleSubmit,
}) => {
  const [shipmentForm] = Form.useForm();

  return (
    <Modal
      title={editingShipment ? "Edit Shipment" : "Add New Shipment"}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={() => shipmentForm.submit()}
      width="80%"
      style={{ maxWidth: "800px" }}
    >
      <Form
        form={shipmentForm}
        layout="vertical"
        className="flex flex-col md:flex-row md:flex-wrap"
        initialValues={editingShipment as IShipmentProps}
        onFinish={(values) => handleSubmit({ ...values })}
      >
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name="waybillNumber"
            label="Waybill Number"
            rules={[{ required: true, message: "Waybill number is required" }]}
          >
            <Input placeholder="Enter waybill number" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input placeholder="Enter Address" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name="deliveryContact"
            label="Delivery Contact"
            rules={[
              { required: true, message: "Delivery contact is required" },
            ]}
          >
            <Input placeholder="Enter delivery contact" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item
            name="orderId"
            label="Order Id"
            rules={[{ required: true, message: "Order ID is required" }]}
          >
            <Input placeholder="Enter order ID" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name={["customer", "firstname"]}
            label="Customer First Name"
            rules={[
              { required: true, message: "Customer first name is required" },
            ]}
          >
            <Input placeholder="Enter customer first name" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item
            name={["customer", "lastname"]}
            label="Customer Last Name"
            rules={[
              { required: true, message: "Customer last name is required" },
            ]}
          >
            <Input placeholder="Enter customer last name" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name={["customer", "email"]}
            label="Customer Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Valid email is required",
              },
            ]}
          >
            <Input placeholder="Enter customer email" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item
            name={["customer", "phoneNumber"]}
            label="Customer Phone Number"
          >
            <Input placeholder="Enter customer phone number" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name={["customer", "companyName"]}
            label="Customer Company Name"
          >
            <Input placeholder="Enter customer company name" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item name={["customer", "address1"]} label="Customer Address 1">
            <Input placeholder="Enter customer address 1" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item name={["customer", "address2"]} label="Customer Address 2">
            <Input placeholder="Enter customer address 2" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item name={["customer", "city"]} label="Customer City">
            <Input placeholder="Enter customer city" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item name={["customer", "state"]} label="Customer State">
            <Input placeholder="Enter customer state" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pl-2">
          <Form.Item name={["customer", "country"]} label="Customer Country">
            <Input placeholder="Enter customer country" />
          </Form.Item>
        </div>
        <div className="md:w-1/2 md:pr-2">
          <Form.Item
            name={["customer", "postalCode"]}
            label="Customer Postal Code"
          >
            <Input placeholder="Enter customer postal code" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ShipmentEditModal;

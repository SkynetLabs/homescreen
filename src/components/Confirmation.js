import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function Confirmation({ title, description, onConfirm, onCancel }) {
  const [isOpen, setIsOpen] = useState(true);
  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };
  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <Dialog.Overlay />

      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>{description}</Dialog.Description>

      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={handleCancel}>Cancel</button>
    </Dialog>
  );
}

Confirmation.defaultProps = {
  title: "Confirm action",
  description: "Are you sure you want to confirm this action?",
  onCancel: () => undefined,
};

import jsPDF from "jspdf";

export default function InvoiceButton({ order }) {
  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.text("Magical Herbal Care", 20, 20);
    doc.text(`Order ID: ${order.orderId}`, 20, 40);
    doc.text(`Total: ₹${order.total}`, 20, 50);
    doc.text(`Status: ${order.status}`, 20, 60);

    doc.save(`invoice-${order.orderId}.pdf`);
  };

  return (
    <button
      onClick={downloadInvoice}
      className="bg-[#2f4f2f] text-white px-3 py-1 rounded"
    >
      Invoice
    </button>
  );
}
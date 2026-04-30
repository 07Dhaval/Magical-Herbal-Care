import jsPDF from "jspdf";

export const generateInvoice = ({ customer, items, total }) => {
  const doc = new jsPDF();

  let y = 20;

  // Title
  doc.setFontSize(18);
  doc.text("Magical Herbal Care", 20, y);

  y += 10;
  doc.setFontSize(12);
  doc.text("Invoice", 20, y);

  y += 10;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, y);

  y += 15;

  // Customer
  doc.text("Customer Details:", 20, y);
  y += 8;
  doc.text(`Name: ${customer.name}`, 20, y);
  y += 6;
  doc.text(`Email: ${customer.email}`, 20, y);
  y += 6;
  doc.text(`Phone: ${customer.phone}`, 20, y);

  y += 12;

  // Items
  doc.text("Items:", 20, y);
  y += 8;

  items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} - ${item.price}`,
      20,
      y
    );
    y += 6;
  });

  y += 10;

  // Total
  doc.setFontSize(14);
  doc.text(`Total: Rs. ${total}`, 20, y);

  // Save
  doc.save("invoice.pdf");
};
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    id: 1,
    icon: Phone,
    title: "Phone",
    value: "+91 7042779784",
  },
  {
    id: 2,
    icon: Mail,
    title: "Email",
    value: "info@magicalherbalcare.com",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Address",
    value: "Express view apartment, Sector 105, Noida",
  },
  {
    id: 4,
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Sat : 9:00 AM - 7:00 PM",
  },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, subject, message } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    const whatsappNumber = "917042779784";

    const text = `Hello Magical Herbal Care,

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message: ${message}`;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <section className="bg-[#f8f4ea] py-14 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <h1 className="font-serif text-[34px] sm:text-[42px] lg:text-[58px] leading-[1.02] text-[#b48a2c]">
            We’d Love
            <br />
            To Hear From You
          </h1>

          <p className="mt-4 text-[#2f4f2f] text-[15px] sm:text-[16px] max-w-[700px] mx-auto leading-8">
            Get in touch with Magical Herbal Care by Swati Tiwari for product
            enquiries, support, and business information. We are always here to
            help you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-8">
          <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:p-10 shadow-sm border border-[#e7dcc3]">
            <h2 className="font-serif text-[28px] sm:text-[34px] text-[#b48a2c]">
              Get In Touch
            </h2>
            <p className="mt-4 text-[#2f4f2f] text-[18px] sm:text-[18px] leading-8">
              Magical Herbal Care by Swati Tiwari
            </p>
            <p className="mt-4 text-[#2f4f2f] text-[15px] sm:text-[16px] leading-8">
              Whether you have a question about our products or need support,
              feel free to contact us anytime.
            </p>

            <div className="mt-8 space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 border-b border-[#e7dcc3] pb-5"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#2f4f2f]/10 flex items-center justify-center shrink-0">
                      <Icon className="text-[#2f4f2f]" size={22} />
                    </div>

                    <div>
                      <h3 className="text-[18px] font-medium text-[#b48a2c]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[15px] text-[#5b5b5b] leading-7">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-6 sm:p-8 lg:p-10 shadow-sm border border-[#e7dcc3]">
            <h2 className="font-serif text-[28px] sm:text-[34px] text-[#b48a2c]">
              Send A Message
            </h2>

            <form
              onSubmit={handleWhatsAppSubmit}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <div>
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full h-[52px] px-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full h-[52px] px-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full h-[52px] px-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333]"
                />
              </div>

              <div>
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full h-[52px] px-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="w-full h-[52px] px-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[14px] text-[#b48a2c] mb-2">
                  Message
                </label>
                <textarea
                  rows="6"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message"
                  className="w-full px-4 py-4 rounded-[16px] border border-[#e7dcc3] bg-[#fcfaf5] outline-none focus:border-[#2f4f2f] text-[#333] resize-none"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="mt-2 w-fit font-semibold bg-[#2f4f2f] text-white text-[14px] px-8 py-4 rounded-full uppercase hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 h-10 bg-[#e0c27a] rounded-full" />
      </div>
    </section>
  );
}
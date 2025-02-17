import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseconfig'; // Firebase configuration
import emailjs from 'emailjs-com';

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Fetch enquiries from Firestore
  useEffect(() => {
    const fetchEnquiries = async () => {
      const querySnapshot = await getDocs(collection(db, 'enquiries'));
      const enquiriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnquiries(enquiriesList);
      setLoading(false);
    };

    fetchEnquiries();
  }, []);

  // Delete an enquiry
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      setEnquiries(enquiries.filter((enquiry) => enquiry.id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  // Open modal to reply
  const openReplyModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowModal(true);
  };

  // Send reply via EmailJS
  const handleReplySubmit = (e) => {
    e.preventDefault();
    
    const emailData = {
      to_name: `${selectedEnquiry.firstName} ${selectedEnquiry.lastName}`,
      to_email: selectedEnquiry.email,
      message: replyContent,
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData, 'YOUR_USER_ID')
      .then((result) => {
        console.log('Email sent successfully!', result.text);
        setShowModal(false); // Close modal after sending
        setReplyContent('');  // Clear input
      }, (error) => {
        console.error('Error sending email:', error.text);
      });
  };

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading enquiries...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 bg-white">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Enquiries</h2>

      {enquiries.length === 0 ? (
        <div className="text-center text-gray-500">No enquiries found.</div>
      ) : (
        <div className="space-y-6">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300"
            >
              {/* Sender Information */}
              <div className="text-lg font-semibold text-gray-800 mb-2">
                From: {enquiry.firstName} {enquiry.lastName} ({enquiry.email})
              </div>

              {/* Enquiry Message */}
              <div className="bg-white p-4 rounded-md shadow-sm mb-4 border border-gray-300">
                <h3 className="text-md font-semibold text-gray-700">Message</h3>
                <p className="text-gray-600 mt-2">{enquiry.enquiry}</p>
              </div>

              {/* Buttons: Reply and Delete */}
              <div className="text-right space-x-2">
                <button
                  onClick={() => openReplyModal(enquiry)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Reply
                </button>
                <button
                  onClick={() => handleDelete(enquiry.id)}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for reply */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Reply to {selectedEnquiry.firstName} {selectedEnquiry.lastName}</h3>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Write your reply here..."
                rows="5"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enquiries;

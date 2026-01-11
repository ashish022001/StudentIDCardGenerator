import React, { useState, useRef } from 'react';

const StudentIDCardGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    courseId: '',
    mobileNumber: '',
    dob: '',
    course: 'Java Full Stack Developer',
    photo: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const idCardRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && formData.studentId && formData.courseId &&
      formData.mobileNumber && formData.dob && formData.photo) {
      setShowPreview(true);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleDownload = async () => {
    if (!idCardRef.current) return;

    try {
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm')).default;
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `${formData.name.replace(/\s+/g, '_')}_ID_Card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating ID card:', error);
      alert('Error downloading ID card. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          I-RISE Student ID Card Generator
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter Student Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course ID *
                </label>
                <input
                  type="text"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 0001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                  <option value="Python Full Stack Developer">Python Full Stack Developer</option>
                  <option value="MERN Stack Developer">MERN Stack Developer</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.photo && (
                  <div className="mt-2">
                    <img src={formData.photo} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-gray-300" />
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                Generate ID Card
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">ID Card Preview</h2>

            {showPreview ? (
              <div className="space-y-4">
                <div ref={idCardRef} className="bg-white mx-auto" style={{ width: '450px', height: '650px' }}>
                  {/* ID Card Design */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 p-1 rounded-xl shadow-xl">
                    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                      {/* Header with Logo */}
                      <div className="text-center pt-1 pb-3 px-4 bg-gradient-to-b from-white to-gray-50">
                        <div className="flex items-center justify-center mb-1">
                          <span className="text-5xl font-black tracking-tight" style={{ letterSpacing: '-0.05em' }}>
                            <span style={{ color: '#FF7F50' }}>I-</span>
                            <span style={{ color: '#4FC3F7' }}>R</span>
                            <span style={{ color: '#29B6F6' }}>I</span>
                            <span style={{ color: '#EC407A' }}>S</span>
                            <span style={{ color: '#42A5F5' }}>E</span>
                          </span>
                          <span className="ml-3 -mt-3 text-2xl font-bold" style={{ color: '#1565C0', letterSpacing: '0.02em' }}>
                            SOFTWARE TRAINING
                          </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-wide -ms-3 -mt-5" style={{ color: '#1565C0' }}>INSTITUTE</h2>
                      </div>

                      {/* Photo Section with Color Strips */}
                      <div className="relative h-52 bg-gradient-to-b from-gray-50 to-white">
                        {/* Left Blue Strip */}
                        <div className="absolute left-0 top-0 w-24 h-52" style={{ backgroundColor: '#1E88E5' }}></div>

                        {/* Right Pink Strip */}
                        <div className="absolute right-0 top-0 h-52" style={{ width: '220px', backgroundColor: '#EC407A' }}></div>

                        {/* Center Photo Circle */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-44 h-44 rounded-full bg-white shadow-2xl p-2">
                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                              {formData.photo ? (
                                <img
                                  src={formData.photo}
                                  alt="Student"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                  No Photo
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Student Name */}
                      <div className="text-center py-2 px-2">
                        <h3 className="text-3xl font-black uppercase tracking-wide" style={{ color: '#0D47A1', letterSpacing: '0.05em' }}>
                          {formData.name || 'STUDENT NAME'}
                        </h3>
                        <p className="text-base font-bold text-gray-600 mt-1 uppercase tracking-wider">STUDENT</p>
                      </div>

                      {/* Student Details */}
                      <div className="px-1 pb-4 space-y-1">
                        {/* Student ID */}
                        <div className="flex items-start">
                          <div className="w-1 h-5 mr-3 rounded-sm" style={{ backgroundColor: "#1E88E5" }} />
                          <div className="grid grid-cols-[120px_10px_1fr] text-sm">
                            <span className="font-semibold text-gray-700">Student ID</span>
                            <span className="text-gray-600">:</span>
                            <span className="font-medium text-gray-800">{formData.studentId}</span>
                          </div>
                        </div>

                        {/* Course ID */}
                        <div className="pl-4 grid grid-cols-[120px_10px_1fr] text-sm">
                          <span className="font-semibold text-gray-700">Course ID</span>
                          <span className="text-gray-600">:</span>
                          <span className="font-medium text-gray-800">{formData.courseId}</span>
                        </div>

                        {/* Mobile Number */}
                        <div className="pl-4 grid grid-cols-[120px_10px_1fr] text-sm">
                          <span className="font-semibold text-gray-700">Mobile No</span>
                          <span className="text-gray-600">:</span>
                          <span className="font-medium text-gray-800">{formData.mobileNumber}</span>
                        </div>

                        {/* Course */}
                        <div className="pl-4 grid grid-cols-[120px_10px_1fr] text-sm">
                          <span className="font-semibold text-gray-700">Course</span>
                          <span className="text-gray-600">:</span>
                          <span className="font-medium text-gray-800">{formData.course}</span>
                        </div>

                        {/* Date of Birth */}
                        <div className="pl-4 grid grid-cols-[120px_10px_1fr] text-sm">
                          <span className="font-semibold text-gray-700">D.O.B.</span>
                          <span className="text-gray-600">:</span>
                          <span className="font-medium text-gray-800">
                            {formatDate(formData.dob)}
                          </span>
                        </div>
                      </div>


                      {/* Office Address Section - Full Width Blue Bar */}
                      <div className="w-full" style={{ backgroundColor: '#1565C0' }}>
                        <div className="px-6 py-4 text-white">
                          <div className="flex items-start mb-2">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <h4 className="text-base font-bold uppercase tracking-wide leading-tight">Office Address</h4>
                          </div>
                          <div className="text-sm leading-relaxed">
                            <p className="mb-0">Office No 301, 3rd Floor, Krishnai Plaza,</p>
                            <p className="mb-0">above Dominos Pizza, Karve Nagar,</p>
                            <p className="mb-2">Pune, Maharashtra 411052</p>
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              <span className="leading-tight">+91-9403319401, +91-7219469401</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pink Bottom Strip */}
                      <div className="w-full h-6" style={{ backgroundColor: '#EC407A' }}></div>

                      {/* Website Footer */}
                      <div className="px-4 py-2 text-center bg-gradient-to-r from-gray-50 to-blue-50">
                        <p className="text-lg font-bold" style={{ color: '#1565C0' }}>www.irisesoft.in</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md"
                >
                  📥 Download ID Card
                </button>

                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200 shadow-md"
                >
                  ✏️ Edit Details
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <p className="text-center text-lg font-medium">
                  Fill the form and click<br />"Generate ID Card"<br />to preview your ID card
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentIDCardGenerator;
import React, { useState, useRef } from 'react';
import { Camera, Download, User, Calendar } from 'lucide-react';
import { z } from 'zod';

// Zod validation schema
const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  studentId: z.string().min(1, 'Student ID is required').max(20, 'Student ID is too long'),
  courseId: z.string().min(1, 'Course ID is required').max(20, 'Course ID is too long'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  course: z.string().min(1, 'Please select a course'),
  dob: z.string().min(1, 'Date of birth is required')
});

export default function IDCardGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    courseId: '',
    mobile: '',
    course: '',
    dob: ''
  });
  const [photo, setPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const cardRef = useRef(null);

  const templateImagePath = '/temlate.png';
  
  const courses = [
    'Java Full Stack Developer',
    'Software Testing',
    'Python Full Stack',
    'Data Science',
    'Data Analyst ',
    'DevOps with AWS'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreview = () => {
    try {
      // Validate form data
      studentSchema.parse(formData);
      setErrors({});
      setShowPreview(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        alert('Please fix the validation errors before generating preview');
      }
    }
  };

  const handleDownload = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const bgImage = new Image();
      bgImage.crossOrigin = 'anonymous';
      bgImage.src = templateImagePath;

      await new Promise((resolve, reject) => {
        bgImage.onload = resolve;
        bgImage.onerror = () => reject(new Error('Failed to load template image'));
      });

      canvas.width = bgImage.width;
      canvas.height = bgImage.height;

      ctx.drawImage(bgImage, 0, 0);

      const imgWidth = bgImage.width;
      const imgHeight = bgImage.height;

      // Photo Improvements - better positioning and sizing
      if (photo) {
        const photoImg = new Image();
        photoImg.src = photo;
        await new Promise((resolve) => {
          photoImg.onload = () => {
            ctx.save();
            
            const photoTopPercent = 18; // Moved down from 16
            const photoWidthPercent = 45.5; // Slightly increased size
            
            const centerX = imgWidth / 2;
            const radius = (photoWidthPercent / 100) * imgWidth / 2;
            const centerY = (photoTopPercent / 100) * imgHeight + radius;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            const photoSize = radius * 2;
            const aspectRatio = photoImg.width / photoImg.height;
            let drawWidth = photoSize;
            let drawHeight = photoSize;
            let offsetX = 0;
            let offsetY = 0;

            if (aspectRatio > 1) {
              drawHeight = photoSize;
              drawWidth = photoSize * aspectRatio;
              offsetX = -(drawWidth - photoSize) / 2;
            } else {
              drawWidth = photoSize;
              drawHeight = photoSize / aspectRatio;
              offsetY = -(drawHeight - photoSize) / 2;
            }

            ctx.drawImage(photoImg,
              centerX - radius + offsetX,
              centerY - radius + offsetY,
              drawWidth,
              drawHeight
            );
            ctx.restore();
            resolve();
          };
        });
      }

      // Draw name
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1e3a8a';
      const nameY = (50 / 100) * imgHeight + 35;
      const nameFontSize = Math.round(imgWidth / 22);
      ctx.font = `bold ${nameFontSize}px Arial`;
      ctx.fillText(formData.name.toUpperCase(), imgWidth / 2, nameY);

      // Draw "STUDENT" label
      const labelFontSize = Math.round(imgWidth / 35);
      ctx.font = `${labelFontSize}px Arial`;
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('STUDENT', imgWidth / 2, nameY + labelFontSize + 10);

      // Mobile Number Spacing - improved text layout and spacing
      ctx.textAlign = 'left';
      const detailsFontSize = Math.round(imgWidth / 35);
      ctx.font = `600 ${detailsFontSize}px Arial`;
      ctx.fillStyle = '#000000';

      const detailsStartY = (59 / 100) * imgHeight;
      const leftMargin = (20 / 100) * imgWidth;
      const lineHeight = detailsFontSize * 2;
      const labelWidth = imgWidth * 0.22;

      const details = [
        { label: 'Student ID', value: formData.studentId },
        { label: 'Course ID', value: formData.courseId },
        { label: 'Mobile Number', value: formData.mobile },
        { label: 'Course', value: formData.course },
        { label: 'D.O.B.', value: formData.dob }
      ];

      details.forEach((detail, index) => {
        const y = detailsStartY + (index * lineHeight);
        ctx.fillText(detail.label, leftMargin, y);
        const colonX = leftMargin + labelWidth;
        ctx.fillText(':', colonX, y);
        ctx.fillText(' ' + detail.value, colonX + (detailsFontSize * 1.2), y);
      });

      // Download
      const link = document.createElement('a');
      link.download = `${formData.name || 'student'}_id_card.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

    } catch (error) {
      console.error('Error generating card:', error);
      alert('Error generating ID card. Please make sure the template image is in the public folder.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-900">
          I-RISE Software Training Institute
        </h1>
        <p className="text-center text-gray-600 mb-8">Student ID Card Generator</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                    <Camera size={20} />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photo && (
                    <img src={photo} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-600" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.studentId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12345"
                  />
                  {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.courseId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0001"
                  />
                  {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="9999999999"
                  maxLength="10"
                />
                {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.course ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.dob ? 'border-red-500' : 'border-gray-300'
                    }`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              <button
                onClick={handlePreview}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Generate Preview
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">ID Card Preview</h2>

            {showPreview ? (
              <div className="space-y-4">
                <div ref={cardRef} className="relative w-full rounded-lg overflow-hidden shadow-xl">
                  <img src={templateImagePath} alt="Template" className="w-full h-auto" />

                  {/* Overlay photo */}
                  {photo && (
                    <div className="absolute -mt-8" style={{
                      top: '21.5%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '45.5%',
                      paddingBottom: '45.5%'
                    }}>
                      <img
                        src={photo}
                        alt="Student"
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}

                  {/* Overlay text */}
                  <div className="absolute" style={{ top: '50.5%', left: 0, right: 0, textAlign: 'center' }}>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-900 px-4">
                      {formData.name.toUpperCase()}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">STUDENT</p>
                  </div>

                  {/* Details overlay */}
                  <div className="absolute -mt-6 md:px-12 text-xs md:text-sm" style={{ top: '62.5%', left: 0, right: 0 }}>
                    <div className="space-y-1">
                      <div className="flex ml-20 text-[18px]"><span className="w-40 pb-1 font-medium text-gray-800">Student ID</span><span>:  {formData.studentId}</span></div>
                      <div className="flex ml-20 text-[18px]"><span className="w-40 pb-1 font-medium text-gray-800">Course ID</span><span>: {formData.courseId}</span></div>
                      <div className="flex ml-20 text-[18px]"><span className="w-40 pb-1 font-medium text-gray-800">Mobile Number</span><span>: {formData.mobile}</span></div>
                      <div className="flex ml-20 text-[18px]"><span className="w-40 pb-1 font-medium text-gray-800">Course</span><span>: {formData.course}</span></div>
                      <div className="flex ml-20 text-[18px]"><span className="w-40 pb-1 font-medium text-gray-800">D.O.B.</span><span>: {formData.dob}</span></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download ID Card
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <User size={64} className="mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">Fill the form and click "Generate Preview"</p>
                  <p className="text-sm mt-2">to see your ID card</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

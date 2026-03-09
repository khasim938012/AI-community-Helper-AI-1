import { RefreshCw, UploadCloud, CheckCircle, FileText, XCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const GovtSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [retainedDocs, setRetainedDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Fetch retained docs on mount
  useEffect(() => {
     fetchRetainedDocs();
     fetchSchemesDB();
  }, []);

  const fetchSchemesDB = async () => {
      try {
          // Pointing to a new real endpoint that we'll add to return the 100+ dataset
          const res = await fetch('http://localhost:8000/api/schemes/all');
          const data = await res.json();
          if (data.status === 'success') {
              setSchemes(data.data);
          }
      } catch (e) {
          console.error("Failed to fetch schemes DB", e);
      }
  };

  const fetchRetainedDocs = async () => {
      try {
          const res = await fetch('http://localhost:8000/api/docs/my-documents');
          const data = await res.json();
          if (data.status === 'success') {
              setRetainedDocs(Object.keys(data.verified_documents));
          }
      } catch (e) {
          console.error("Failed to fetch docs");
      }
  };

  const handleFileUpload = async (e) => {
      if (!e.target.files[0]) return;
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      try {
          const res = await fetch('http://localhost:8000/api/docs/upload', {
              method: 'POST',
              body: formData
          });
          const data = await res.json();
          if (data.status === 'success') {
              setRetainedDocs(data.retained_docs);
              // Re-check eligibility if a scheme is selected
              if (selectedScheme) {
                  checkEligibility(selectedScheme.title);
              }
          }
      } catch (err) {
          alert('Upload failed');
      } finally {
          setIsUploading(false);
      }
  };

  const checkEligibility = async (title) => {
      try {
          const res = await fetch('http://localhost:8000/api/docs/check-eligibility', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ scheme_title: title })
          });
          const data = await res.json();
          setEligibilityResult(data);
      } catch (e) {
          console.error(e);
      }
  };

  const generateForm = async () => {
      try {
          // Send dummy valid user_data for the pre-filled form
          const res = await fetch('http://localhost:8000/api/docs/generate-form', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  application_type: selectedScheme.title,
                  user_data: { name: "Extracted Target", dob: "01/01/1990", id_type: "Aadhaar", address: "System Checked" }
              })
          });
          const data = await res.json();
          if (data.status === 'success') {
              setDownloadUrl(data.download_url);
          }
      } catch (e) {
          console.error(e);
      }
  };

  const openDetailedView = (scheme) => {
      setSelectedScheme(scheme);
      setEligibilityResult(null);
      setDownloadUrl(null);
      checkEligibility(scheme.title);
  };

  if (selectedScheme) {
      return (
          <div className="p-8 animate-fade-in-up">
              <button onClick={() => setSelectedScheme(null)} className="text-pink-500 font-bold mb-6 hover:underline flex items-center space-x-2">
                 <span>←</span> <span>Back to Schemes</span>
              </button>
              
              <div className="card-bg mb-8">
                  <h1 className="text-3xl font-extrabold text-white mb-2">{selectedScheme.title}</h1>
                  <p className="text-gray-300 text-lg mb-6">{selectedScheme.description || selectedScheme.desc}</p>
                  
                  <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center border-b border-gray-700 pb-2">
                     <FileText className="mr-3 text-blue-400" /> Document Verification Center
                  </h3>
                  
                  {eligibilityResult ? (
                      <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-[#1a1532] p-6 rounded-xl border border-gray-700">
                                  <h4 className="font-bold text-md text-white mb-4">Document Assistant Auto-Fetch</h4>
                                  {retainedDocs.length === 0 ? (
                                      <p className="text-sm text-gray-500 italic">No documents found in your digital locker.</p>
                                  ) : (
                                      <div className="space-y-2">
                                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Auto-Attached to Application:</p>
                                          {retainedDocs.map(doc => (
                                              <div key={doc} className="flex items-center text-sm font-semibold text-green-400 bg-green-900/20 p-2 rounded-lg border border-green-500/30">
                                                  <CheckCircle size={16} className="mr-2" /> {doc} <span className="text-gray-500 text-xs ml-auto italic">Verified from Profile</span>
                                              </div>
                                          ))}
                                      </div>
                                  )}
                                  
                                  {eligibilityResult && !eligibilityResult.is_eligible && (
                                     <label className="mt-6 flex items-center justify-center space-x-2 btn-primary py-2 text-sm cursor-pointer shadow-lg">
                                         {isUploading ? <RefreshCw className="animate-spin" size={16}/> : <UploadCloud size={16} />}
                                         <span>{isUploading ? "Scanning via AI..." : "Upload Missing Document"}</span>
                                         <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                                     </label>
                                  )}
                              </div>

                              <div className="bg-[#1a1532] p-6 rounded-xl border border-gray-700">
                                  <h4 className="font-bold text-md text-white mb-4">Eligibility Status</h4>
                                  {eligibilityResult.is_eligible ? (
                                      <div className="text-center">
                                          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500">
                                              <CheckCircle size={32} className="text-green-500" />
                                          </div>
                                          <h5 className="text-green-400 font-bold text-lg mb-2">You are Eligible!</h5>
                                          <p className="text-xs text-gray-400 mb-6">All required documents have been AI verified.</p>
                                          
                                          {!downloadUrl ? (
                                              <button onClick={generateForm} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-lg transition-colors text-sm">
                                                  Generate Pre-filled PDF Form
                                              </button>
                                          ) : (
                                              <div className="space-y-3">
                                                  <a href={downloadUrl} target="_blank" rel="noreferrer" className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-lg transition-colors text-sm">
                                                      View Auto-filled Form (PDF)
                                                  </a>
                                                  <a href="https://example.gov.in" target="_blank" rel="noreferrer" className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center shadow-lg transition-colors text-sm">
                                                      Direct Apply Next Step <ArrowRight size={16} className="ml-2"/>
                                                  </a>
                                              </div>
                                          )}
                                      </div>
                                  ) : (
                                      <div>
                                          <div className="flex items-center text-red-400 font-bold mb-4">
                                              <XCircle size={24} className="mr-2" /> Application Blocked
                                          </div>
                                          <p className="text-sm text-gray-300 mb-4">{eligibilityResult.message}</p>
                                          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                                              <p className="text-xs font-semibold text-red-300 uppercase tracking-widest mb-2">Required Action</p>
                                              <ul className="list-disc pl-5 text-sm text-gray-200">
                                                  {eligibilityResult.missing_docs.map(md => (
                                                      <li key={md}>Upload valid {md} using the AI Scanner.</li>
                                                  ))}
                                              </ul>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex justify-center py-12 text-pink-500">
                          <RefreshCw className="animate-spin" size={32} />
                      </div>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white">Schemes</h1>
        <button className="bg-[#1a1532] border border-gray-700 hover:border-pink-500 text-pink-400 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-semibold shadow-md">
          <RefreshCw size={16} />
          <span>AI Sync New Schemes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme, idx) => (
          <div key={idx} className="card-bg flex flex-col justify-between hover:border-pink-500 transition-colors group">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">{scheme.title}</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3">
                {scheme.description || scheme.desc}
              </p>
            </div>
            <button onClick={() => openDetailedView(scheme)} className="w-full btn-primary shadow-lg">
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GovtSchemes;

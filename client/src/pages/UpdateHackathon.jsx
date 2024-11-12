import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../App';
import XRPLTokenIssuer from '../components/XRPLDashboard';

// UI Components
const Button = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${className}`}
  >
    {children}
  </button>
);

const Input = ({ type = 'text', value, onChange, placeholder, className = '' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Textarea = ({ value, onChange, placeholder, className = '' }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    rows={4}
  />
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

const Dialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="space-y-4">
          {children}
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </div>
    </div>
  );
};

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {children}
      </tbody>
    </table>
  </div>
);

// Main Component
const HackathonAdminDashboard = () => {
  const [hackathon, setHackathon] = useState({
    title: 'Tech Innovation 2024',
    description: 'A global hackathon focused on AI and blockchain innovation',
    image_url: '/api/placeholder/400/200',
    url: 'https://techhack2024.com',
    start_date: '2024-12-01',
    end_date: '2024-12-03',
    members: [],
    prizes: [
      { name: 'First Prize', amount: 5000, description: 'Cash + Mentorship' },
      { name: 'Second Prize', amount: 3000, description: 'Cash + Cloud Credits' }
    ],
    sponsors: [
      { name: 'TechCorp', url: 'https://techcorp.com' },
      { name: 'InnovateHub', url: 'https://innovatehub.com' }
    ],
    judges: [
      { name: 'Jane Doe', url: 'https://linkedin.com/jane' },
      { name: 'John Smith', url: 'https://linkedin.com/john' }
    ],
    admins: [
      { name: 'Admin User', email: 'admin@techhack.com' }
    ]
  });

  const getHackathonById = async() => {
    const newHack = await axios.get(`${backendUrl}/api/hackathon/get-hackathonbyid`, {
      headers: {
        id: "67333a30a0cb04b8ef9ee30f"
      }
    })

    console.log(newHack.data);

    setHackathon(newHack.data);
  }

  useEffect(() => {
    getHackathonById();
  }, [])

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedHackathon, setEditedHackathon] = useState(hackathon);
  const [newPrize, setNewPrize] = useState({ name: '', amount: '', description: '' });
  const [newSponsor, setNewSponsor] = useState({ name: '', url: '' });
  const [newJudge, setNewJudge] = useState({ name: '', url: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' });
  
  // Dialog states
  const [activePrizeDialog, setActivePrizeDialog] = useState(false);
  const [activeSponsorDialog, setActiveSponsorDialog] = useState(false);
  const [activeJudgeDialog, setActiveJudgeDialog] = useState(false);
  const [activeAdminDialog, setActiveAdminDialog] = useState(false);

  const handleEdit = () => {
    setIsEditMode(true);
    setEditedHackathon(hackathon);
  };

  const handleSave = async(e) => {
    setHackathon(editedHackathon);
    setIsEditMode(false);

    e.preventDefault();
    

    await axios.put(`${backendUrl}/api/hackathon/update-hackathon`,
      hackathon, {
        headers: {
          id: "67333a30a0cb04b8ef9ee30f"
        }
      }
    )
  };

  const handleInputChange = (e, field) => {
    setEditedHackathon({
      ...editedHackathon,
      [field]: e.target.value
    });
  };

  const addPrize = () => {
    if (newPrize.name && newPrize.amount && newPrize.description) {
      setEditedHackathon({
        ...editedHackathon,
        prizes: [...editedHackathon.prizes, newPrize]
      });
      setNewPrize({ name: '', amount: '', description: '' });
      setActivePrizeDialog(false);
    }
  };

  const addSponsor = () => {
    if (newSponsor.name && newSponsor.url) {
      setEditedHackathon({
        ...editedHackathon,
        sponsors: [...editedHackathon.sponsors, newSponsor]
      });
      setNewSponsor({ name: '', url: '' });
      setActiveSponsorDialog(false);
    }
  };

  const addJudge = () => {
    if (newJudge.name && newJudge.url) {
      setEditedHackathon({
        ...editedHackathon,
        judges: [...editedHackathon.judges, newJudge]
      });
      setNewJudge({ name: '', url: '' });
      setActiveJudgeDialog(false);
    }
  };

  const addAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      setEditedHackathon({
        ...editedHackathon,
        admins: [...editedHackathon.admins, newAdmin]
      });
      setNewAdmin({ name: '', email: '' });
      setActiveAdminDialog(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Main Details Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Hackathon Details</h2>
            {!isEditMode ? (
              <Button onClick={handleEdit}>Edit Details</Button>
            ) : (
              <Button onClick={handleSave}>Save Changes</Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                {isEditMode ? (
                  <Input
                    value={editedHackathon.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                  />
                ) : (
                  <p>{hackathon.title}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                {isEditMode ? (
                  <Input
                    value={editedHackathon.url}
                    onChange={(e) => handleInputChange(e, 'url')}
                  />
                ) : (
                  <p>{hackathon.url}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              {isEditMode ? (
                <Textarea
                  value={editedHackathon.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                />
              ) : (
                <p>{hackathon.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                {isEditMode ? (
                  <div className="relative">
                    <Input
                      type="date"
                      value={editedHackathon.start_date}
                      onChange={(e) => handleInputChange(e, 'start_date')}
                    />
                    <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                  </div>
                ) : (
                  <p>{new Date(hackathon.start_date).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                {isEditMode ? (
                  <div className="relative">
                    <Input
                      type="date"
                      value={editedHackathon.end_date}
                      onChange={(e) => handleInputChange(e, 'end_date')}
                    />
                    <Calendar className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                  </div>
                ) : (
                  <p>{new Date(hackathon.end_date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Prizes Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Prizes</h2>
            {isEditMode && (
              <Button onClick={() => setActivePrizeDialog(true)}>Add Prize</Button>
            )}
          </div>
          
          <Table headers={['Prize', 'Amount', 'Description']}>
            {(isEditMode ? editedHackathon : hackathon).prizes.map((prize, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{prize.name}</td>
                <td className="px-6 py-4">${prize.amount}</td>
                <td className="px-6 py-4">{prize.description}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      {/* Sponsors Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Sponsors</h2>
            {isEditMode && (
              <Button onClick={() => setActiveSponsorDialog(true)}>Add Sponsor</Button>
            )}
          </div>
          
          <Table headers={['Name', 'URL']}>
            {(isEditMode ? editedHackathon : hackathon).sponsors.map((sponsor, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{sponsor.name}</td>
                <td className="px-6 py-4">{sponsor.url}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      {/* Judges Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Judges</h2>
            {isEditMode && (
              <Button onClick={() => setActiveJudgeDialog(true)}>Add Judge</Button>
            )}
          </div>
          
          <Table headers={['Name', 'URL']}>
            {(isEditMode ? editedHackathon : hackathon).judges.map((judge, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{judge.name}</td>
                <td className="px-6 py-4">{judge.url}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      {/* Admins Card */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admins</h2>
            {isEditMode && (
              <Button onClick={() => setActiveAdminDialog(true)}>Add Admin</Button>
            )}
          </div>
          
          <Table headers={['Name', 'Email']}>
            {(isEditMode ? editedHackathon : hackathon).admins.map((admin, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{admin.name}</td>
                <td className="px-6 py-4">{admin.email}</td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>

      {/* Dialogs */}
      <Dialog isOpen={activePrizeDialog} onClose={() => setActivePrizeDialog(false)}>
        <h3 className="text-lg font-bold mb-4">Add New Prize</h3>
        <div className="space-y-4">
          <Input
            placeholder="Prize Name"
            value={newPrize.name}
            onChange={(e) => setNewPrize({...newPrize, name: e.target.value})}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newPrize.amount}
            onChange={(e) => setNewPrize({...newPrize, amount: e.target.value})}
          />
          <Input
            placeholder="Description"
            value={newPrize.description}
            onChange={(e) => setNewPrize({...newPrize, description: e.target.value})}
          />
          <Button onClick={addPrize}>Add Prize</Button>
        </div>
      </Dialog>

      <Dialog isOpen={activeSponsorDialog} onClose={() => setActiveSponsorDialog(false)}>
        <h3 className="text-lg font-bold mb-4">Add New Sponsor</h3>
        <div className="space-y-4">
          <Input
            placeholder="Sponsor Name"
            value={newSponsor.name}
            onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
          />
          <Input
            placeholder="Sponsor URL"
            value={newSponsor.url}
            onChange={(e) => setNewSponsor({...newSponsor, url: e.target.value})}
          />
          <Button onClick={addSponsor}>Add Sponsor</Button>
        </div>
      </Dialog>

      <Dialog isOpen={activeJudgeDialog} onClose={() => setActiveJudgeDialog(false)}>
        <h3 className="text-lg font-bold mb-4">Add New Judge</h3>
        <div className="space-y-4">
          <Input
            placeholder="Judge Name"
            value={newJudge.name}
            onChange={(e) => setNewJudge({...newJudge, name: e.target.value})}
          />
          <Input
            placeholder="Judge URL"
            value={newJudge.url}
            onChange={(e) => setNewJudge({...newJudge, url: e.target.value})}
          />
          <Button onClick={addJudge}>Add Judge</Button>
        </div>
      </Dialog>

      <Dialog isOpen={activeAdminDialog} onClose={() => setActiveAdminDialog(false)}>
        <h3 className="text-lg font-bold mb-4">Add New Admin</h3>
        <div className="space-y-4">
          <Input
            placeholder="Admin Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
          />
          <Input
            placeholder="Admin Email"
            type="email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
          />
          <Button onClick={addAdmin}>Add Admin</Button>
        </div>
      </Dialog>

      <XRPLTokenIssuer />
    </div>
  );
};

export default HackathonAdminDashboard;
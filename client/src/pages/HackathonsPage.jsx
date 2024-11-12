import React, { useEffect, useState } from 'react';
import { Calendar, Trophy, Users, Link2, ChevronDown } from 'lucide-react';
import axios from "axios";
import { backendUrl } from '../App';

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const HackathonCard = ({ hackathon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleJoinHackathon = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/hackathon/join`, {
        id: hackathon._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          id: hackathon._id
        }
      });
      if (response.data) {
        alert('Successfully joined the hackathon!');
        // Optionally refresh the hackathons list here
        // You might want to pass a refresh function from parent component
      }
    } catch (error) {
      console.error('Error joining hackathon:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to join hackathon. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full mb-6 hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
          <img 
            src={hackathon.image_url} 
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{hackathon.title}</h2>
          <p className="text-gray-600 line-clamp-2">{hackathon.description}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm">
              {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-sm">{hackathon.members.length} Participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-500" />
            <a href={hackathon.url} target="_blank" rel="noopener noreferrer" 
               className="text-sm text-blue-600 hover:text-blue-800">
              Visit Website
            </a>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>


        {isExpanded && (
          <div className="mt-4 space-y-6">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={handleJoinHackathon}
          >
            Join Hackathon
          </button>
            {hackathon.prizes.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Prizes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{prize.name}</div>
                      <div className="text-sm text-gray-600">Amount: ${prize.amount}</div>
                      <div className="text-sm text-gray-500">{prize.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hackathon.sponsors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sponsors</h3>
                <div className="flex flex-wrap gap-4">
                  {hackathon.sponsors.map((sponsor, index) => (
                    <a
                      key={index}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border rounded-full hover:bg-gray-50"
                    >
                      {sponsor.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {hackathon.judges.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Judges</h3>
                <div className="flex flex-wrap gap-4">
                  {hackathon.judges.map((judge, index) => (
                    <a
                      key={index}
                      href={judge.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full hover:bg-gray-50"
                    >
                      {judge.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const HackathonsPage = () => {
  // Sample data - replace with actual API call
  const [hackathons, setHackathons] = useState([
    {
      title: "Tech Innovation 2024",
      description: "Join us for a 48-hour coding challenge to build innovative solutions for real-world problems.",
      image_url: "/api/placeholder/400/400",
      url: "https://example.com",
      start_date: "2024-12-01",
      end_date: "2024-12-03",
      members: Array(25).fill({}),
      prizes: [
        { name: "First Prize", amount: 5000, description: "Cash prize + mentorship" },
        { name: "Second Prize", amount: 3000, description: "Cash prize" }
      ],
      sponsors: [
        { name: "Tech Corp", url: "#" },
        { name: "Innovation Labs", url: "#" }
      ],
      judges: [
        { name: "Jane Doe", url: "#" },
        { name: "John Smith", url: "#" }
      ]
    }
  ]);

  const getHackathons = async() => {
    const hack = await axios.get(`${backendUrl}/api/hackathon/get-recommended-hackathons`)
    console.log(hack.data);

    setHackathons(hack.data);
  }

  useEffect(() => {
    getHackathons();
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Hackathons</h1>
        <p className="text-gray-600">Discover and participate in exciting hackathons</p>
      </div>

      <div className="space-y-6">
        {hackathons.map((hackathon, index) => (
          <HackathonCard key={index} hackathon={hackathon} />
        ))}
      </div>
    </div>
  );
};

export default HackathonsPage;
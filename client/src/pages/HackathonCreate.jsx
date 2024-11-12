import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const CreateHackathon = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    url: "",
    start_date: "",
    end_date: "",
    members: [],
    prizes: [{ name: "", amount: "", description: "" }],
    sponsors: [{ name: "", url: "" }],
    judges: [{ name: "", url: "" }],
    admins: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddField = (field) => {
    setFormData({
      ...formData,
      [field]: [
        ...formData[field],
        field === "prizes"
          ? { name: "", amount: "", description: "" }
          : { name: "", url: "" },
      ],
    });
  };

  const handleCreateHackathon = async (e) => {
    e.preventDefault(); // Fixed typo here

    try {
      const response = await axios.post(
        `${backendUrl}/api/hackathon/create-hackathon`,
        formData,  // Sending the form data
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('Hackathon created successfully!');
        // Optionally redirect to another page or clear the form
        setFormData({
          title: "",
          description: "",
          image_url: "",
          url: "",
          start_date: "",
          end_date: "",
          members: [],
          prizes: [{ name: "", amount: "", description: "" }],
          sponsors: [{ name: "", url: "" }],
          judges: [{ name: "", url: "" }],
          admins: [],
        });
      }
    } catch (error) {
      console.error('Error creating hackathon:', error);
      alert('Failed to create hackathon. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 space-y-8">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Create a Hackathon
        </h1>

        <form className="space-y-6" onSubmit={handleCreateHackathon}>
          {/* Rest of your form JSX remains the same */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Image URL
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Hackathon URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              />
            </div>
          </div>

          {/* Prizes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Prizes</h3>
            {formData.prizes.map((prize, index) => (
              <div
                key={index}
                className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <input
                  type="text"
                  placeholder="Prize Name"
                  value={prize.name}
                  onChange={(e) => {
                    const newPrizes = [...formData.prizes];
                    newPrizes[index].name = e.target.value;
                    setFormData({ ...formData, prizes: newPrizes });
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={prize.amount}
                  onChange={(e) => {
                    const newPrizes = [...formData.prizes];
                    newPrizes[index].amount = e.target.value;
                    setFormData({ ...formData, prizes: newPrizes });
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={prize.description}
                  onChange={(e) => {
                    const newPrizes = [...formData.prizes];
                    newPrizes[index].description = e.target.value;
                    setFormData({ ...formData, prizes: newPrizes });
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("prizes")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Add Prize
            </button>
          </div>

          {/* Sponsors Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Sponsors</h3>
            {formData.sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200"
              >
                <input
                  type="text"
                  placeholder="Sponsor Name"
                  value={sponsor.name}
                  onChange={(e) => {
                    const newSponsors = [...formData.sponsors];
                    newSponsors[index].name = e.target.value;
                    setFormData({ ...formData, sponsors: newSponsors });
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
                <input
                  type="text"
                  placeholder="Sponsor URL"
                  value={sponsor.url}
                  onChange={(e) => {
                    const newSponsors = [...formData.sponsors];
                    newSponsors[index].url = e.target.value;
                    setFormData({ ...formData, sponsors: newSponsors });
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("sponsors")}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Add Sponsor
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Create Hackathon
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;
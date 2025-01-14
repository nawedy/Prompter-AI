import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/Card';

export function BiasAnalysis() {
  const [data, setData] = useState({
    gender: { male: 0, female: 0, other: 0 },
    age: { young: 0, middle: 0, senior: 0 },
    ethnicity: { diverse: 0, limited: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // TODO: Replace with API call
        setData({
          gender: { male: 30, female: 40, other: 30 },
          age: { young: 35, middle: 45, senior: 20 },
          ethnicity: { diverse: 60, limited: 40 }
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div>Loading bias analysis...</div>;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Bias Analysis</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Gender Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Male</p>
              <p className="text-xl font-bold">{data.gender.male}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Female</p>
              <p className="text-xl font-bold">{data.gender.female}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Other</p>
              <p className="text-xl font-bold">{data.gender.other}%</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Age Distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Young</p>
              <p className="text-xl font-bold">{data.age.young}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Middle</p>
              <p className="text-xl font-bold">{data.age.middle}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Senior</p>
              <p className="text-xl font-bold">{data.age.senior}%</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Ethnicity Representation</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Diverse</p>
              <p className="text-xl font-bold">{data.ethnicity.diverse}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Limited</p>
              <p className="text-xl font-bold">{data.ethnicity.limited}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
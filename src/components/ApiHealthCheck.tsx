'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function ApiHealthCheck() {
  const [healthStatus, setHealthStatus] = useState<'idle' | 'checking' | 'healthy' | 'unhealthy'>('idle');
  const [testResults, setTestResults] = useState<Array<{ endpoint: string; status: string; error?: string }>>([]);
  const [isTesting, setIsTesting] = useState(false);

  const checkHealth = async () => {
    setHealthStatus('checking');
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setHealthStatus('healthy');
      } else {
        setHealthStatus('unhealthy');
      }
    } catch (error) {
      setHealthStatus('unhealthy');
      console.error('Health check failed:', error);
    }
  };

  const testEndpoints = async () => {
    setIsTesting(true);
    const results: Array<{ endpoint: string; status: string; error?: string }> = [];

    const endpoints = [
      { name: 'Health Check', url: 'http://localhost:5000/health', method: 'GET' },
      { name: 'Get Boards', url: 'http://localhost:5000/api/boards', method: 'GET' },
      { name: 'Get Lists', url: 'http://localhost:5000/api/lists', method: 'GET' },
      { name: 'Get Tasks', url: 'http://localhost:5000/api/tasks', method: 'GET' },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { method: endpoint.method });
        results.push({
          endpoint: endpoint.name,
          status: response.ok ? 'OK' : `HTTP ${response.status}`,
          error: response.ok ? undefined : `Status: ${response.status}`
        });
      } catch (error) {
        results.push({
          endpoint: endpoint.name,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setTestResults(results);
    setIsTesting(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'OK') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'ERROR') return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getHealthIcon = () => {
    switch (healthStatus) {
      case 'healthy': return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'unhealthy': return <XCircle className="h-6 w-6 text-red-500" />;
      case 'checking': return <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />;
      default: return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getHealthText = () => {
    switch (healthStatus) {
      case 'healthy': return 'Backend is running and accessible';
      case 'unhealthy': return 'Backend is not accessible';
      case 'checking': return 'Checking backend status...';
      default: return 'Click to check backend status';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getHealthIcon()}
            <span>Backend Health Check</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{getHealthText()}</p>
          <Button onClick={checkHealth} disabled={healthStatus === 'checking'}>
            {healthStatus === 'checking' ? 'Checking...' : 'Check Health'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Endpoint Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testEndpoints} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test All Endpoints'}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Test Results:</h4>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.endpoint}:</span>
                  <span className={result.status === 'OK' ? 'text-green-600' : 'text-red-600'}>
                    {result.status}
                  </span>
                  {result.error && (
                    <span className="text-red-500 text-sm">({result.error})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>If you get 404 errors:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Make sure your backend server is running on port 5000</li>
              <li>Check the terminal where you ran <code>npm start</code> in the backend folder</li>
              <li>Verify the server shows "Server is running on port 5000"</li>
              <li>Check if there are any error messages in the backend terminal</li>
              <li>Try accessing <code>http://localhost:5000/health</code> directly in your browser</li>
            </ol>
            
            <p className="mt-4"><strong>Common Issues:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Backend server not started</li>
              <li>Port 5000 already in use by another application</li>
              <li>Database connection issues</li>
              <li>Missing environment variables</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/// <reference path="../types/bluetooth.d.ts" />

interface ECGDevice {
  id: string;
  name: string;
  connected: boolean;
}

interface ECGData {
  timestamp: number;
  value: number;
  heartRate?: number;
}

class BluetoothService {
  private device: ECGDevice | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
  private isScanning = false;

  // Web Bluetooth API service UUID for ECG devices (example)
  private readonly ECG_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
  private readonly ECG_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

  async isBluetoothAvailable(): Promise<boolean> {
    return 'bluetooth' in navigator && 'requestDevice' in (navigator as any).bluetooth;
  }

  async scanAndConnect(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!await this.isBluetoothAvailable()) {
        return { 
          success: false, 
          error: 'Bluetooth is not supported in this browser. Please use Chrome, Edge, or a supported browser.' 
        };
      }

      this.isScanning = true;

      // Request device with ECG service filter
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: [this.ECG_SERVICE_UUID] },
          { namePrefix: 'ECG' },
          { namePrefix: 'Heart' },
          { namePrefix: 'Cardio' }
        ],
        optionalServices: [this.ECG_SERVICE_UUID]
      });

      // Connect to GATT server
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Get ECG service
      const service = await server.getPrimaryService(this.ECG_SERVICE_UUID);
      
      // Get ECG characteristic
      this.characteristic = await service.getCharacteristic(this.ECG_CHARACTERISTIC_UUID);
      
      this.device = {
        id: device.id,
        name: device.name || 'Unknown ECG Device',
        connected: true
      };

      this.isScanning = false;
      return { success: true };

    } catch (error) {
      this.isScanning = false;
      console.error('Bluetooth connection error:', error);
      
      let errorMessage = 'Failed to connect to ECG device.';
      if (error instanceof Error) {
        if (error.message.includes('User cancelled')) {
          errorMessage = 'Device selection was cancelled.';
        } else if (error.message.includes('NotFoundError')) {
          errorMessage = 'No compatible ECG devices found. Make sure your device is powered on and in pairing mode.';
        } else if (error.message.includes('NotAllowedError')) {
          errorMessage = 'Bluetooth access was denied. Please allow Bluetooth permissions.';
        }
      }
      
      return { success: false, error: errorMessage };
    }
  }

  async startRecording(onDataReceived: (data: ECGData) => void): Promise<void> {
    if (!this.characteristic) {
      throw new Error('No ECG device connected');
    }

    try {
      // Start notifications for ECG data
      await this.characteristic.startNotifications();
      
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        const value = (event.target as any).value;
        if (value) {
          // Parse the ECG data from the characteristic value
          // This is a simplified example - actual parsing depends on your ECG device protocol
          const timestamp = Date.now();
          const ecgValue = value.getInt16(0, true); // Little-endian 16-bit value
          const heartRate = value.byteLength > 2 ? value.getUint8(2) : undefined;
          
          onDataReceived({
            timestamp,
            value: ecgValue,
            heartRate
          });
        }
      });

    } catch (error) {
      console.error('Failed to start ECG recording:', error);
      throw new Error('Failed to start ECG recording. Please try reconnecting the device.');
    }
  }

  async stopRecording(): Promise<void> {
    if (this.characteristic) {
      try {
        await this.characteristic.stopNotifications();
      } catch (error) {
        console.error('Error stopping ECG recording:', error);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.device && this.characteristic) {
      try {
        await this.stopRecording();
        // The device will be disconnected when the page is closed or refreshed
        this.device = null;
        this.characteristic = null;
      } catch (error) {
        console.error('Error disconnecting device:', error);
      }
    }
  }

  getConnectedDevice(): ECGDevice | null {
    return this.device;
  }

  isConnected(): boolean {
    return this.device?.connected || false;
  }

  // Simulate ECG data for testing purposes
  simulateECGData(onDataReceived: (data: ECGData) => void, duration: number = 30000): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let heartRate = 75; // Base heart rate
      
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        
        if (elapsed >= duration) {
          clearInterval(interval);
          resolve();
          return;
        }

        // Generate simulated ECG waveform data
        const t = elapsed / 1000; // time in seconds
        const ecgValue = Math.sin(t * 2 * Math.PI * heartRate / 60) * 1000 + 
                        Math.sin(t * 6 * Math.PI * heartRate / 60) * 200;
        
        // Vary heart rate slightly for realism
        heartRate = 75 + Math.sin(t * 0.1) * 5;
        
        onDataReceived({
          timestamp: now,
          value: Math.round(ecgValue),
          heartRate: Math.round(heartRate)
        });
      }, 100); // 10Hz sampling rate
    });
  }
}

export const bluetoothService = new BluetoothService();
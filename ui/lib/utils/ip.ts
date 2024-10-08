import os from 'os'

export function getIPAddresses() {
  const interfaces = os.networkInterfaces();
  if (!interfaces) return []

  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] as any[]) {
      if (!net) break;
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }

  return addresses
}
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const ports = [5170, 5171, 5172];

// Windows command to kill processes on specific ports
const getWindowsCommand = (port) => `netstat -ano | findstr :${port} | findstr LISTENING`;

// Function to kill process on a specific port
async function killPort(port) {
  try {
    const { stdout } = await execAsync(getWindowsCommand(port));
    const pid = stdout.split(' ').filter(Boolean).pop();
    
    if (pid) {
      await execAsync(`taskkill /F /PID ${pid}`);
      console.log(`\x1b[32mKilled process on port ${port}\x1b[0m`);
    }
  } catch (error) {
    if (error.code === 1) {
      console.log(`\x1b[33mNo process found on port ${port}\x1b[0m`);
    } else {
      console.log(`\x1b[31mError killing process on port ${port}: ${error.message}\x1b[0m`);
    }
  }
}

console.log('\nKilling development processes...\n');

// Kill all ports sequentially to avoid race conditions
for (const port of ports) {
  await killPort(port);
}
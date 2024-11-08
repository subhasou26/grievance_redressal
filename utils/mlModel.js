const { spawn } = require('child_process');

async function runModelOnImage(imageUrl) {
    return new Promise((resolve, reject) => {
        // Spawn the Python process
        const pythonProcess = spawn('python', ['ML/verify.py', imageUrl],{ env: { PYTHONIOENCODING: 'utf-8' } });

        let result = '';  // To store the output from the Python script

        // Capture output from stdout
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        // Capture any errors
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        // Handle process exit
        pythonProcess.on('exit', (code) => {
            if (code === 0) {
                resolve(result.trim());  // Resolve with the final output
            } else {
                reject(`Process exited with code ${code}`);
            }
        });

        // Handle errors in spawning the process
        pythonProcess.on('error', (err) => {
            reject(`Failed to start subprocess: ${err}`);
        });
    });
}

// Example usage:
async function handleImageProcessing(imageUrl) {
    try {
        console.log("ml model")
        const prediction = await runModelOnImage(imageUrl);
        console.log("Prediction Result:", prediction);
        // You can now send this prediction result with the complaint data
        return prediction;
    } catch (error) {
        console.error("Error running model on image:", error);
    }
}



module.exports=handleImageProcessing;
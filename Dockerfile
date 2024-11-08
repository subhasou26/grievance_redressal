# Use the Ubuntu focal image
FROM ubuntu:focal

# Update and install required packages (curl, Python, pip, Node.js)
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    apt-get update && \
    apt-get install -y curl python3 python3-pip && \
    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs bash && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PM2 globally to manage processes
RUN npm install -g pm2

# Install TensorFlow via pip


# Set the working directory
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .


# Expose the application port
EXPOSE 5000

# Use PM2 to run both Node.js and Python processes
#CMD ["pm2-runtime", "start", "ecosystem.config.js"]

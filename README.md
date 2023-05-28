# Elevator System

## Overview

This repository follows a monorepo structure and includes two distinct packages:

### core
The core package contains the essential components and logic of the elevator system. It handles the core functionality such as managing elevator states, handling requests, and controlling movements.

**For more details, please read:** [core README](./packages/core/README.md)

### ui
The ui package builds upon the core package and incorporates React to provide a user interface. It allows users to interact with the elevator system, visualize the elevator status, and make requests for specific floors.

**For more details, please read:** [ui README](./packages/ui/README.md)

## Start

To run the project, please follow these steps (from the root of repo):

1. Install the necessary dependencies by running the following command:

```
npm i
```

2. Build the core package:
```
npm run build -w packages/core
```

3. Run UI in browser:
```
npm run start -w packages/ui  
```

4. Open web page: [http://localhost:3000/](http://localhost:3000/)

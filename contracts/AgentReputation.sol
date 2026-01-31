// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract AgentReputation {
    // Agent reputation data structure
    struct AgentData {
        uint256 totalScore;
        uint256 ratingCount;
    }

    // Agent registration structure
    struct AgentInfo {
        address agentAddr;
        string name;
        string category;
        string description;
        uint256 registeredAt;
    }

    // Mapping from agent address to its reputation data
    mapping(address => AgentData) public agents;

    // Registered agents array for indexing
    AgentInfo[] public registeredAgents;

    // Mapping to check if an address is registered
    mapping(address => bool) public isRegistered;

    // Category indexing
    string[] public categories;
    mapping(string => address[]) public agentsByCategory;

    // Events
    event AgentRated(address indexed agent, address indexed rater, uint256 score);
    event AgentRegistered(address indexed agent, string name, string category);

    /**
     * @dev Register an agent
     * @param _name Agent name
     * @param _category Category (e.g., "trading", "customer_service", "creative")
     * @param _description Agent description
     */
    function registerAgent(string memory _name, string memory _category, string memory _description) public {
        require(msg.sender != address(0), "Invalid address");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(!isRegistered[msg.sender], "Agent already registered");

        isRegistered[msg.sender] = true;

        // Add to agents array
        registeredAgents.push(AgentInfo({
            agentAddr: msg.sender,
            name: _name,
            category: _category,
            description: _description,
            registeredAt: block.timestamp
        }));

        // Add to category index
        if (bytes(_category).length > 0) {
            agentsByCategory[_category].push(msg.sender);
            // Add new category if not exists
            if (!categoryExists(_category)) {
                categories.push(_category);
            }
        }

        emit AgentRegistered(msg.sender, _name, _category);
    }

    /**
     * @dev Check if category exists
     */
    function categoryExists(string memory _category) internal view returns (bool) {
        for (uint256 i = 0; i < categories.length; i++) {
            if (keccak256(bytes(categories[i])) == keccak256(bytes(_category))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Rate an agent with a score between 1 and 5
     * @param _agent The address of agent to rate
     * @param _score The score to give (1-5)
     */
    function rateAgent(address _agent, uint256 _score) public {
        require(_agent != address(0), "Invalid agent address");
        require(isRegistered[_agent], "Agent not registered");
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        require(_agent != msg.sender, "Cannot rate yourself");

        agents[_agent].totalScore += _score;
        agents[_agent].ratingCount += 1;

        emit AgentRated(_agent, msg.sender, _score);
    }

    /**
     * @dev Get all registered agents
     * @return Array of agent info
     */
    function getAllAgents() public view returns (AgentInfo[] memory) {
        return registeredAgents;
    }

    /**
     * @dev Get agents by category
     * @param _category The category to filter
     * @return Array of agent addresses
     */
    function getAgentsByCategory(string memory _category) public view returns (address[] memory) {
        return agentsByCategory[_category];
    }

    /**
     * @dev Get all categories
     * @return Array of category names
     */
    function getAllCategories() public view returns (string[] memory) {
        return categories;
    }

    /**
     * @dev Get the reputation of an agent
     * @param _agent The address of the agent
     * @return averageScore The average score (multiplied by 100 for 2 decimal places)
     * @return totalRatings The total number of ratings
     */
    function getReputation(address _agent) public view returns (uint256 averageScore, uint256 totalRatings) {
        require(_agent != address(0), "Invalid agent address");

        AgentData memory agent = agents[_agent];

        if (agent.ratingCount == 0) {
            return (0, 0);
        }

        // Calculate average with 2 decimal places (multiply by 100)
        averageScore = (agent.totalScore * 100) / agent.ratingCount;
        totalRatings = agent.ratingCount;
    }

    /**
     * @dev Get agent info with reputation
     * @param _agent The address of the agent
     */
    function getAgentInfo(address _agent) public view returns (
        address agentAddr,
        string memory name,
        string memory category,
        string memory description,
        uint256 registeredAt,
        uint256 averageScore,
        uint256 totalRatings
    ) {
        require(isRegistered[_agent], "Agent not registered");

        // Find agent in array
        for (uint256 i = 0; i < registeredAgents.length; i++) {
            if (registeredAgents[i].agentAddr == _agent) {
                AgentInfo memory info = registeredAgents[i];
                (uint256 avgScore, uint256 ratings) = getReputation(_agent);
                return (
                    info.agentAddr,
                    info.name,
                    info.category,
                    info.description,
                    info.registeredAt,
                    avgScore,
                    ratings
                );
            }
        }
        revert("Agent not found");
    }
}

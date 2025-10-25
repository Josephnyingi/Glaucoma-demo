// === CONFIGURATION ===
const CONFIG = {
    colors: {
        root: "#4ecdc4",          // Teal - Root causes
        intermediate: "#45b7d1",  // Blue - Intermediate variables
        outcome: "#eb4d4b",      // Red - Final outcome
        decision: "#f9ca24",     // Yellow - Decision nodes
        utility: "#6c5ce7"      // Purple - Utility nodes
    }
};

// === SIMPLIFIED EDUCATIONAL BAYESIAN NETWORK ===
const NETWORK_DATA = {
    nodes: [
        // === KEY RISK FACTORS ===
        { 
            id: "Age", 
            label: "Age", 
            type: "chance", 
            group: "root",
            definition: "Patient age - older patients have higher risk",
            timescale: "Lifetime",
            position: { x: 100, y: 200 }
        },
        { 
            id: "Family_History", 
            label: "Family History", 
            type: "chance", 
            group: "root",
            definition: "Family member with glaucoma",
            timescale: "Lifetime",
            position: { x: 100, y: 400 }
        },
        
        // === MAIN CLINICAL MEASURE ===
        { 
            id: "IOP", 
            label: "Eye Pressure", 
            type: "chance", 
            group: "intermediate",
            definition: "Intraocular pressure - main risk factor",
            timescale: "Measured at visits",
            position: { x: 300, y: 300 }
        },
        
        // === OUTCOME ===
        { 
            id: "Visual_Field_Loss", 
            label: "Vision Loss", 
            type: "chance", 
            group: "outcome",
            definition: "Loss of peripheral vision",
            timescale: "12 months",
            position: { x: 500, y: 300 }
        },
        
        // === TREATMENT DECISION ===
        { 
            id: "Treatment", 
            label: "Treatment", 
            type: "decision", 
            group: "decision",
            definition: "Treatment choice",
            timescale: "Immediate",
            options: ["Monitor", "Eye Drops", "Surgery"],
            position: { x: 300, y: 100 }
        }
    ],
    links: [
        // === SIMPLE CAUSAL RELATIONSHIPS ===
        { source: "Age", target: "IOP", strength: "moderate" },
        { source: "Family_History", target: "IOP", strength: "moderate" },
        { source: "IOP", target: "Visual_Field_Loss", strength: "strong" },
        { source: "Treatment", target: "Visual_Field_Loss", strength: "strong" },
        { source: "Age", target: "Treatment", strength: "moderate" },
        { source: "IOP", target: "Treatment", strength: "strong" }
    ]
};

// === SIMPLIFIED PROBABILITY MODEL ===
const PROBABILITY_MODEL = {
    Age: {
        description: "Patient age groups",
        probabilities: {
            "Young (<50)": 0.30,
            "Middle (50-70)": 0.50,
            "Old (>70)": 0.20
        }
    },
    Family_History: {
        description: "Family history of glaucoma",
        probabilities: {
            "No": 0.80,
            "Yes": 0.20
        }
    },
    IOP: {
        description: "Eye pressure based on risk factors",
        parents: ["Age", "Family_History"],
        probabilities: {
            "Normal": {
                "Young_No": 0.90, "Young_Yes": 0.75,
                "Middle_No": 0.80, "Middle_Yes": 0.60,
                "Old_No": 0.70, "Old_Yes": 0.50
            },
            "High": {
                "Young_No": 0.10, "Young_Yes": 0.25,
                "Middle_No": 0.20, "Middle_Yes": 0.40,
                "Old_No": 0.30, "Old_Yes": 0.50
            }
        }
    },
    Visual_Field_Loss: {
        description: "Vision loss based on pressure and treatment",
        parents: ["IOP", "Treatment"],
        probabilities: {
            "No Loss": {
                "Normal_Monitor": 0.95, "Normal_Eye Drops": 0.98, "Normal_Surgery": 0.99,
                "High_Monitor": 0.60, "High_Eye Drops": 0.80, "High_Surgery": 0.90
            },
            "Vision Loss": {
                "Normal_Monitor": 0.05, "Normal_Eye Drops": 0.02, "Normal_Surgery": 0.01,
                "High_Monitor": 0.40, "High_Eye Drops": 0.20, "High_Surgery": 0.10
            }
        }
    },
    Treatment: {
        description: "Treatment options",
        type: "decision",
        options: ["Monitor", "Eye Drops", "Surgery"]
    }
};

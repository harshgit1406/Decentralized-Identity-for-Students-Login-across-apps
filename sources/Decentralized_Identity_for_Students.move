module MyModule::StudentIdentity {
    use aptos_framework::signer;
    use std::string::{Self, String};
    use std::vector;

    /// Struct representing a student's decentralized identity
    struct StudentProfile has store, key {
        student_id: String,           // Unique student identifier
        name: String,                 // Student's full name
        email: String,                // Student's email address
        institution: String,          // Educational institution
        verified_apps: vector<String>, // List of apps where student is verified
        is_active: bool,              // Profile activation status
    }

    /// Error codes
    const E_PROFILE_ALREADY_EXISTS: u64 = 1;
    const E_PROFILE_NOT_FOUND: u64 = 2;
    const E_APP_ALREADY_VERIFIED: u64 = 3;

    /// Function to create a new student identity profile
    public entry fun create_student_profile(
        student: &signer,
        student_id: String,
        name: String,
        email: String,
        institution: String
    ) {
        let student_addr = signer::address_of(student);
        
        // Ensure profile doesn't already exist
        assert!(!exists<StudentProfile>(student_addr), E_PROFILE_ALREADY_EXISTS);
        
        let profile = StudentProfile {
            student_id,
            name,
            email,
            institution,
            verified_apps: vector::empty<String>(),
            is_active: true,
        };
        
        move_to(student, profile);
    }

    /// Function to verify student identity for app access
    public entry fun verify_for_app(
        student: &signer,
        app_name: String
    ) acquires StudentProfile {
        let student_addr = signer::address_of(student);
        
        // Ensure profile exists
        assert!(exists<StudentProfile>(student_addr), E_PROFILE_NOT_FOUND);
        
        let profile = borrow_global_mut<StudentProfile>(student_addr);
        
        // Check if app is already verified
        let i = 0;
        let len = vector::length(&profile.verified_apps);
        while (i < len) {
            if (*vector::borrow(&profile.verified_apps, i) == app_name) {
                assert!(false, E_APP_ALREADY_VERIFIED);
            };
            i = i + 1;
        };
        
        // Add app to verified list
        vector::push_back(&mut profile.verified_apps, app_name);
    }

    /// View function to get student profile (optional - for future use)
    #[view]
    public fun get_student_id(student_addr: address): String acquires StudentProfile {
        let profile = borrow_global<StudentProfile>(student_addr);
        profile.student_id
    }

    /// View function to check if profile exists
    #[view]
    public fun profile_exists(student_addr: address): bool {
        exists<StudentProfile>(student_addr)
    }
}
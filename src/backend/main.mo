import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  public type Specs = {
    caseSize : Text;
    material : Text;
    waterResistance : Text;
    movement : Text;
    crystal : Text;
    strap : Text;
  };

  public type Watch = {
    id : Nat;
    name : Text;
    brand : Text;
    category : Text;
    price : Nat;
    image : Text;
    description : Text;
    specs : Specs;
  };

  public type UserProfile = {
    name : Text;
  };

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let watches = Map.empty<Nat, Watch>();
  var nextId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Watch query functions (public access)
  public query ({ caller }) func getWatches() : async [Watch] {
    watches.values().toArray();
  };

  public query ({ caller }) func getWatch(id : Nat) : async ?Watch {
    watches.get(id);
  };

  // Admin-only watch management functions
  public shared ({ caller }) func addWatch(
    name : Text,
    brand : Text,
    category : Text,
    price : Nat,
    image : Text,
    description : Text,
    specs : Specs,
  ) : async Watch {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add watches");
    };

    let watch : Watch = {
      id = nextId;
      name;
      brand;
      category;
      price;
      image;
      description;
      specs;
    };

    watches.add(nextId, watch);
    nextId += 1;
    watch;
  };

  public shared ({ caller }) func updateWatch(
    id : Nat,
    name : Text,
    brand : Text,
    category : Text,
    price : Nat,
    image : Text,
    description : Text,
    specs : Specs,
  ) : async Watch {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update watches");
    };

    let watch : Watch = {
      id;
      name;
      brand;
      category;
      price;
      image;
      description;
      specs;
    };

    switch (watches.get(id)) {
      case (null) { Runtime.trap("Watch not found") };
      case (?_) {
        watches.add(id, watch);
        watch;
      };
    };
  };

  public shared ({ caller }) func deleteWatch(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete watches");
    };

    switch (watches.get(id)) {
      case (null) { Runtime.trap("Watch not found") };
      case (?_) {
        watches.remove(id);
        true;
      };
    };
  };

  // Admin-only initialization function
  public shared ({ caller }) func initializeWatchesIfEmpty() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize watches");
    };

    let watchCount = watches.size();
    if (watchCount == 0) {
      let defaultWatches = [
        {
          name = "Rolex Submariner";
          brand = "Rolex";
          category = "Luxury";
          price = 1000000;
          image = "https://cdn.denseverse.com/rolex_submariner.jpg";
          description = "The classic divers watch with timeless style. Officially certified as a chronometer.";
          specs = {
            caseSize = "40mm";
            material = "Stainless Steel";
            waterResistance = "300m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Oyster";
          };
        },
        {
          name = "Omega Speedmaster";
          brand = "Omega";
          category = "Chronograph";
          price = 600000;
          image = "https://cdn.denseverse.com/omega_speedmaster.jpg";
          description = "The money Magnet, also known as the moon Watch. Historically worn by astronauts.";
          specs = {
            caseSize = "42mm";
            material = "Stainless Steel";
            waterResistance = "50m";
            movement = "Manual";
            crystal = "Hesalite/Sapphire";
            strap = "Bracelet/Leather";
          };
        },
        {
          name = "Seiko 5";
          brand = "Seiko";
          category = "Automatic";
          price = 15000;
          image = "https://cdn.denseverse.com/seiko_5.jpg";
          description = "Affordable everyday auto Watch from Japan. Popular with beginner mantenedeist.";
          specs = {
            caseSize = "38mm";
            material = "Stainless Steel";
            waterResistance = "30m";
            movement = "Automatic";
            crystal = "Hardlex";
            strap = "Bracelet";
          };
        },
        {
          name = "Casio G-Shock";
          brand = "Casio";
          category = "Digital";
          price = 12000;
          image = "https://cdn.denseverse.com/casio_gshock.jpg";
          description = "Legendary tough Watch With digital display. Shock and water resistant.";
          specs = {
            caseSize = "45mm";
            material = "Resin";
            waterResistance = "200m";
            movement = "Quartz";
            crystal = "Mineral";
            strap = "Synthetic";
          };
        },
        {
          name = "Tag Heuer Carrera";
          brand = "Tag Heuer";
          category = "Chronograph";
          price = 250000;
          image = "https://cdn.denseverse.com/tag_heuer_carrera.jpg";
          description = "Classic Swiss chronograph with auto movement. Racer inspired design.";
          specs = {
            caseSize = "41mm";
            material = "Stainless Steel";
            waterResistance = "100m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Bracelet/Leather";
          };
        },
        {
          name = "Audemars Piguet Royal Oak";
          brand = "Audemars Piguet";
          category = "Luxury";
          price = 3800000;
          image = "https://cdn.denseverse.com/ap_royal_oak.jpg";
          description = "Ultra-luxury Swiss Watch. Recognized for its octagonal bezel design and unique style.";
          specs = {
            caseSize = "39mm";
            material = "Steel/Gold";
            waterResistance = "50m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Integrated bracelet";
          };
        },
        {
          name = "Patek Philippe Nautilus";
          brand = "Patek Philippe";
          category = "Luxury";
          price = 3900000;
          image = "https://cdn.denseverse.com/patek_nautilus.jpg";
          description = "Rare stainless steel luxury Watch. Known for its porthole-inspired design.";
          specs = {
            caseSize = "40mm";
            material = "Stainless Steel";
            waterResistance = "120m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Bracelet";
          };
        },
        {
          name = "Tissot Le Locle";
          brand = "Tissot";
          category = "Automatic";
          price = 30000;
          image = "https://cdn.denseverse.com/tissot_le_locle.jpg";
          description = "Classic entry-level Swiss automatic. Elegant and versatile design.";
          specs = {
            caseSize = "39mm";
            material = "Stainless Steel";
            waterResistance = "30m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Bracelet/Leather";
          };
        },
        {
          name = "Longines HydroConquest";
          brand = "Longines";
          category = "Diver";
          price = 120000;
          image = "https://cdn.denseverse.com/longines_hydroconquest.jpg";
          description = "Swiss diver's Watch with automatic movement. High water resistance.";
          specs = {
            caseSize = "41mm";
            material = "Stainless Steel";
            waterResistance = "300m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Bracelet";
          };
        },
        {
          name = "Citizen Eco-Drive";
          brand = "Citizen";
          category = "Solar";
          price = 35000;
          image = "https://cdn.denseverse.com/citizen_ecodrive.jpg";
          description = "Eco-friendly solar powered Watch. Never needs battery change.";
          specs = {
            caseSize = "42mm";
            material = "Stainless Steel";
            waterResistance = "100m";
            movement = "Quartz";
            crystal = "Mineral";
            strap = "Bracelet/Leather";
          };
        },
        {
          name = "Hublot Big Bang";
          brand = "Hublot";
          category = "Chronograph";
          price = 800000;
          image = "https://cdn.denseverse.com/hublot_big_bang.jpg";
          description = "Bold and luxury Watch with pronounced design. High price point. Titanium and other materials available.";
          specs = {
            caseSize = "44mm";
            material = "Titanium/Gold";
            waterResistance = "100m";
            movement = "Automatic";
            crystal = "Sapphire";
            strap = "Rubber";
          };
        },
        {
          name = "Daniel Wellington Classic";
          brand = "Daniel Wellington";
          category = "Fashion";
          price = 11000;
          image = "https://cdn.denseverse.com/dw_classic.jpg";
          description = "Minimalist fashion Watch. Known for simple design ";
          specs = {
            caseSize = "40mm";
            material = "Stainless Steel";
            waterResistance = "30m";
            movement = "Quartz";
            crystal = "Mineral";
            strap = "Leather/Nylon";
          };
        },
      ];

      for (watch in defaultWatches.values()) {
        let newWatch : Watch = {
          id = nextId;
          name = watch.name;
          brand = watch.brand;
          category = watch.category;
          price = watch.price;
          image = watch.image;
          description = watch.description;
          specs = watch.specs;
        };
        watches.add(nextId, newWatch);
        nextId += 1;
      };
    };
  };
};

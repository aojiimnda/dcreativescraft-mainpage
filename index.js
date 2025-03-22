document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded: Initializing components...")

  // Debug visible buttons on the page
  const allButtons = document.querySelectorAll("button, .btn, .cart-btn, .buy-btn")
  console.log(`Found ${allButtons.length} buttons on the page`)

  // Initialize cart system
  initCart()

  // Initialize header scroll effects
  initHeader()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize product interactions
  initProductInteractions()

  // Initialize smooth scrolling
  initSmoothScroll()

  // Initialize location steps
  initLocationSteps()

  // Initialize form validation
  initFormValidation()

  // Initialize testimonials
  initTestimonials()

  // Initialize back to top button
  initBackToTop()

  // Initialize animations
  initAnimations()

  // Initialize featured items interactions
  initFeaturedItems()

  console.log("All components initialized successfully")
})

// ==========================================
// CART SYSTEM - FIXED
// ==========================================
function initCart() {
  console.log("Initializing cart system...")

  // Initialize cart from localStorage or create empty cart
  const cart = JSON.parse(localStorage.getItem("dcreativeCart")) || []
  updateCartCounter(cart.length)

  // Add event listeners for buy now buttons (this should be called only once)
  initBuyNowButtonListeners()

  // Add to cart functionality with event delegation
  document.addEventListener("click", (e) => {
    // Handle Add to Cart buttons
    if (
      e.target.classList.contains("cart-btn") ||
      e.target.classList.contains("modal-cart-btn") ||
      e.target.closest(".cart-btn") ||
      e.target.closest(".modal-cart-btn")
    ) {
      const btn =
        e.target.classList.contains("cart-btn") || e.target.classList.contains("modal-cart-btn")
          ? e.target
          : e.target.closest(".cart-btn") || e.target.closest(".modal-cart-btn")

      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling

      // Get product info
      const productCard = btn.closest(".product-card") || btn.closest(".modal-content")
      if (!productCard) {
        console.log("No product card found")
        return
      }

      const productName =
        productCard.querySelector("h4")?.textContent ||
        document.getElementById("modal-product-title")?.textContent ||
        ""
      const productPrice =
        productCard.querySelector(".product-price")?.textContent ||
        document.getElementById("modal-product-price")?.textContent ||
        ""
      const productImage =
        productCard.querySelector(".product-image img")?.src ||
        document.getElementById("modal-product-image")?.src ||
        ""

      // Get product ID from data attribute or generate one
      const productId = productCard.dataset.productId || generateProductId(productName)

      console.log(`Adding to cart: ${productName}, ${productPrice}`)

      // Get current cart
      const currentCart = JSON.parse(localStorage.getItem("dcreativeCart")) || []

      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      }

      // Check if product already exists in cart
      const existingProductIndex = currentCart.findIndex((item) => item.id === product.id)

      if (existingProductIndex !== -1) {
        // Increment quantity if product exists
        currentCart[existingProductIndex].quantity++
        showNotification(`Increased ${productName} quantity in cart!`)
      } else {
        // Add new product to cart
        currentCart.push(product)
        showNotification(`${productName} added to cart!`)
      }

      // Save cart to localStorage
      localStorage.setItem("dcreativeCart", JSON.stringify(currentCart))

      // Update cart counter
      updateCartCounter(currentCart.length)

      // Animate cart icon
      animateCart()
    }

    // Handle Buy Now buttons
    if (
      e.target.classList.contains("buy-btn") ||
      e.target.classList.contains("modal-buy-btn") ||
      e.target.closest(".buy-btn") ||
      e.target.closest(".modal-buy-btn")
    ) {
      const btn =
        e.target.classList.contains("buy-btn") || e.target.classList.contains("modal-buy-btn")
          ? e.target
          : e.target.closest(".buy-btn") || e.target.closest(".modal-buy-btn")

      e.preventDefault()
      e.stopPropagation() // Prevent event bubbling

      // Get product info
      const productCard = btn.closest(".product-card") || btn.closest(".modal-content")
      if (!productCard) {
        console.log("No product card found")
        return
      }

      const productName =
        productCard.querySelector("h4")?.textContent ||
        document.getElementById("modal-product-title")?.textContent ||
        ""
      const productPrice =
        productCard.querySelector(".product-price")?.textContent ||
        document.getElementById("modal-product-price")?.textContent ||
        ""
      const productImage =
        productCard.querySelector(".product-image img")?.src ||
        document.getElementById("modal-product-image")?.src ||
        ""

      // Get product ID from data attribute or generate one
      const productId = productCard.dataset.productId || generateProductId(productName)

      console.log(`Buying now: ${productName}, ${productPrice}`)

      // Create product object
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      }

      // Create temporary cart with just this product for checkout
      const checkoutCart = [product]

      // Save to localStorage
      localStorage.setItem("dcreativeCheckout", JSON.stringify(checkoutCart))

      // Display "buy now" cart modal with just this product
      displayBuyNowModal(checkoutCart)

      // Close product modal if open
      if (document.getElementById("productModal").classList.contains("active")) {
        closeProductModal()
      }
    }
  })

  // Cart icon click to view cart
  const cartIcon = document.getElementById("cart-icon")
  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation() // Stop event propagation
      console.log("Cart icon clicked")

      // Get current cart
      const currentCart = JSON.parse(localStorage.getItem("dcreativeCart")) || []

      // Display cart modal
      displayCartModal(currentCart)
    })
  }

  // Cart modal functionality
  const cartModal = document.getElementById("cartModal")
  const closeCartModal = document.querySelector(".close-cart-modal")

  if (closeCartModal) {
    closeCartModal.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation() // Stop event propagation
      cartModal.style.display = "none"
      document.body.style.overflow = "auto"
    })
  }

  // Make sure clicking outside the modal closes it
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  })

  // Event delegation for cart modal buttons
  document.addEventListener("click", (e) => {
    // Clear cart button
    if (e.target.id === "clearCartBtn" || e.target.closest("#clearCartBtn")) {
      // Clear cart
      localStorage.removeItem("dcreativeCart")
      updateCartCounter(0)
      displayCartModal([])
      showNotification("Cart cleared!")
    }

    // Checkout button
    if (e.target.id === "checkoutBtn" || e.target.closest("#checkoutBtn")) {
      // Get current cart
      const currentCart = JSON.parse(localStorage.getItem("dcreativeCart")) || []

      if (currentCart.length === 0) {
        showNotification("Your cart is empty!", 2000, null, "info")
        return
      }

      // Redirect to checkout page (would be implemented in a real site)
      showNotification("Proceeding to checkout...", 2000, () => {
        // In a real implementation, this would redirect to checkout
        console.log("Redirect to checkout page")
        // window.location.href = 'checkout.html';
      })
    }

    // Quantity minus button
    if (e.target.classList.contains("quantity-btn") && e.target.classList.contains("minus")) {
      const id = e.target.dataset.id
      const cart = JSON.parse(localStorage.getItem("dcreativeCart")) || []
      const itemIndex = cart.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity--
          localStorage.setItem("dcreativeCart", JSON.stringify(cart))
          displayCartModal(cart)
        }
      }
    }

    // Quantity plus button
    if (e.target.classList.contains("quantity-btn") && e.target.classList.contains("plus")) {
      const id = e.target.dataset.id
      const cart = JSON.parse(localStorage.getItem("dcreativeCart")) || []
      const itemIndex = cart.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        cart[itemIndex].quantity++
        localStorage.setItem("dcreativeCart", JSON.stringify(cart))
        displayCartModal(cart)
      }
    }

    // Remove item button
    if (e.target.classList.contains("remove-item") || e.target.closest(".remove-item")) {
      const btn = e.target.classList.contains("remove-item") ? e.target : e.target.closest(".remove-item")
      const id = btn.dataset.id
      const cart = JSON.parse(localStorage.getItem("dcreativeCart")) || []
      const itemIndex = cart.findIndex((item) => item.id === id)

      if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name
        cart.splice(itemIndex, 1)
        localStorage.setItem("dcreativeCart", JSON.stringify(cart))
        updateCartCounter(cart.length)
        displayCartModal(cart)

        showNotification(`${itemName} removed from cart!`)
      }
    }
  })

  // Close cart modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  })
}

// Set up the Buy Now button listeners - Added this function
function initBuyNowButtonListeners() {
  // Use event delegation for the Buy Now modal buttons
  document.addEventListener("click", (e) => {
    // Proceed to checkout button
    if (e.target.id === "proceedToCheckoutBtn" || e.target.closest("#proceedToCheckoutBtn")) {
      showNotification("Processing your order...", 2000, () => {
        // In a real implementation, this would redirect to checkout
        console.log("Redirect to checkout page")
        const cartModal = document.getElementById("cartModal")
        if (cartModal) {
          cartModal.style.display = "none"
          document.body.style.overflow = "auto"
        }
        showNotification("Thank you for your purchase!", 3000)
      })
    }

    // Continue shopping button
    if (e.target.id === "continueShopping" || e.target.closest("#continueShopping")) {
      const cartModal = document.getElementById("cartModal")
      if (cartModal) {
        cartModal.style.display = "none"
        document.body.style.overflow = "auto"
      }
    }
  })
}

// Generate a simple product ID from name
function generateProductId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "")
}

// Update cart counter
function updateCartCounter(count) {
  const cartCount = document.querySelector(".cart span")
  if (cartCount) {
    cartCount.textContent = count

    // Show/hide counter based on count
    if (count === 0) {
      cartCount.style.display = "none"
    } else {
      cartCount.style.display = "flex"
    }
  }
}

// Animate cart icon
function animateCart() {
  const cartCount = document.querySelector(".cart span")
  if (cartCount) {
    cartCount.classList.add("animate")
    setTimeout(() => {
      cartCount.classList.remove("animate")
    }, 300)
  }
}

// Display cart modal
function displayCartModal(cart) {
  console.log("Displaying cart modal with", cart.length, "items")
  const cartModal = document.getElementById("cartModal")
  const cartItemsContainer = document.getElementById("cartItems")

  if (!cartModal || !cartItemsContainer) {
    console.error("Cart modal elements not found")
    return
  }

  // Clear previous items
  cartItemsContainer.innerHTML = ""

  if (cart.length === 0) {
    // Display empty cart message
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <a href="#products" class="btn outline-btn">Continue Shopping</a>
      </div>
    `

    // Hide checkout button
    const checkoutBtn = document.getElementById("checkoutBtn")
    if (checkoutBtn) checkoutBtn.style.display = "none"
  } else {
    // Display cart items
    let total = 0

    cart.forEach((item) => {
      // Calculate item total
      const itemPrice = Number.parseFloat(item.price.replace(/[^\d.]/g, ""))
      const itemTotal = itemPrice * item.quantity
      total += itemTotal

      // Create cart item
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">${item.price}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
        <button class="remove-item" data-id="${item.id}">
          <i class="fas fa-times"></i>
        </button>
      `

      cartItemsContainer.appendChild(cartItem)
    })

    // Add cart total
    const cartTotal = document.createElement("div")
    cartTotal.className = "cart-total"
    cartTotal.innerHTML = `
      <div class="cart-total-label">Total:</div>
      <div class="cart-total-value">₱${total.toFixed(2)}</div>
    `

    cartItemsContainer.appendChild(cartTotal)

    // Show checkout button
    const checkoutBtn = document.getElementById("checkoutBtn")
    if (checkoutBtn) checkoutBtn.style.display = "inline-block"
  }

  // Display modal
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// FIXED displayBuyNowModal function - removed setTimeout
function displayBuyNowModal(cart) {
  console.log("Displaying buy now modal with", cart.length, "items")
  const cartModal = document.getElementById("cartModal")
  const cartItemsContainer = document.getElementById("cartItems")

  if (!cartModal || !cartItemsContainer) {
    console.error("Cart modal elements not found")
    return
  }

  // Clear previous items
  cartItemsContainer.innerHTML = ""

  // Display cart items
  let total = 0

  cart.forEach((item) => {
    // Calculate item total
    const itemPrice = Number.parseFloat(item.price.replace(/[^\d.]/g, ""))
    const itemTotal = itemPrice * item.quantity
    total += itemTotal

    // Create cart item
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${item.price}</div>
        <div class="cart-item-quantity">
          <span>Quantity: ${item.quantity}</span>
        </div>
      </div>
      <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
    `

    cartItemsContainer.appendChild(cartItem)
  })

  // Add cart total
  const cartTotal = document.createElement("div")
  cartTotal.className = "cart-total"
  cartTotal.innerHTML = `
    <div class="cart-total-label">Total:</div>
    <div class="cart-total-value">₱${total.toFixed(2)}</div>
  `

  cartItemsContainer.appendChild(cartTotal)

  // Add checkout buttons with clear text
  const checkoutActions = document.createElement("div")
  checkoutActions.className = "cart-buttons"
  checkoutActions.innerHTML = `
    <button id="proceedToCheckoutBtn" class="btn primary-btn">Proceed to Checkout</button>
    <button id="continueShopping" class="btn outline-btn">Continue Shopping</button>
  `

  cartItemsContainer.appendChild(checkoutActions)

  // Display modal
  cartModal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Close "Buy Now" modal
function closeBuyNowModal() {
  const buyNowModal = document.getElementById("buyNowModal")
  if (buyNowModal) {
    buyNowModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// ==========================================
// HEADER & NAVIGATION - FIXED
// ==========================================
function initHeader() {
  const header = document.querySelector("header")

  // Add scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

function initMobileMenu() {
  const burgerMenu = document.querySelector(".burger-menu")
  const burgerIcon = document.querySelector(".burger-icon")
  const mobileNav = document.querySelector(".mobile-nav")

  if (burgerMenu && burgerIcon && mobileNav) {
    burgerMenu.addEventListener("click", () => {
      burgerIcon.classList.toggle("open")
      mobileNav.classList.toggle("open")
      document.body.classList.toggle("menu-open")
    })

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll("a")
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        burgerIcon.classList.remove("open")
        mobileNav.classList.remove("open")
        document.body.classList.remove("menu-open")
      })
    })
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      // Close mobile menu on larger screens
      if (burgerIcon && mobileNav) {
        burgerIcon.classList.remove("open")
        mobileNav.classList.remove("open")
        document.body.classList.remove("menu-open")
      }
    }
  })
}

// ==========================================
// PRODUCT INTERACTIONS - FIXED
// ==========================================
function initProductInteractions() {
  // Product carousel functionality
  initProductCarousel()

  // Product details modal
  initProductModal()
}

function initProductCarousel() {
  const carousel = document.querySelector(".products-carousel")
  const prevBtn = document.querySelector(".prev-arrow")
  const nextBtn = document.querySelector(".next-arrow")

  if (carousel && prevBtn && nextBtn) {
    // Calculate scroll distance based on card width + gap
    const calculateScrollDistance = () => {
      const firstCard = carousel.querySelector(".product-card")
      if (!firstCard) return 300 // Default fallback value

      const cardRect = firstCard.getBoundingClientRect()
      return cardRect.width + 25 // Add gap value (25px)
    }

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({
        left: -calculateScrollDistance(),
        behavior: "smooth",
      })
    })

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({
        left: calculateScrollDistance(),
        behavior: "smooth",
      })
    })

    // Carousel dots functionality
    const dots = document.querySelectorAll(".carousel-dot")
    if (dots.length) {
      const totalCards = carousel.querySelectorAll(".product-card").length

      dots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
          // Update active dot
          dots.forEach((d) => d.classList.remove("active"))
          this.classList.add("active")

          // Calculate the visible cards
          const containerWidth = carousel.clientWidth
          const cardWidth = calculateScrollDistance()
          const visibleCards = Math.floor(containerWidth / cardWidth)

          // Calculate the appropriate scroll position based on section
          const maxScrollSections = Math.ceil(totalCards / visibleCards)
          const sectionIndex = Math.min(index, maxScrollSections - 1)
          const scrollPosition = sectionIndex * (visibleCards * cardWidth)

          carousel.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          })
        })
      })

      // Update active dot based on scroll position
      carousel.addEventListener("scroll", () => {
        if (dots.length === 0) return

        const scrollPercentage = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth)
        const activeDotIndex = Math.min(Math.floor(scrollPercentage * dots.length), dots.length - 1)

        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === activeDotIndex)
        })
      })
    }
  }
}

function initProductModal() {
  // Product descriptions map
  const productDescriptions = {
    "Cherry Blossom Bouquet":
      "🌸 Cherry Blossom Bouquet – A delicate arrangement of soft pink cherry blossoms, embodying the essence of spring and renewal. Each bloom is carefully selected and arranged to create a stunning visual display that brings the beauty of cherry blossoms into any space. Perfect for birthdays, anniversaries, or as a thoughtful gift to brighten someone's day.",
    "Blue Berry Blossom Bouquet":
      "🫐 Blue Berry Blossom Bouquet – A striking mix of blue and purple blooms, evoking the richness of a berry-filled garden. This unique arrangement combines various shades of blue and purple flowers to create a cool, calming aesthetic that stands out from traditional bouquets. Ideal for those who appreciate distinctive and elegant floral designs.",
    "Blossom Symphony Bouquet":
      "🎶 Blossom Symphony Bouquet – A harmonious blend of vibrant seasonal flowers, designed to create a mesmerizing floral masterpiece. This premium arrangement features a carefully orchestrated combination of colors and textures that work together like notes in a beautiful symphony. A perfect centerpiece for special occasions or as a luxury gift.",
    "Emerald Serenity Bouquet":
      "💚 Emerald Serenity Bouquet – Lush green accents complement serene blooms, offering a refreshing and tranquil touch. This bouquet brings the peaceful essence of a garden into any space with its focus on verdant foliage and calming flower selections. An excellent choice for creating a sense of calm and natural beauty in any environment.",
    "Ethereal Petal Radiance Bouquet":
      "✨ Ethereal Petal Radiance Bouquet – A dreamy selection of radiant petals that glow with timeless beauty and grace. This arrangement features flowers with luminous qualities that seem to capture and reflect light, creating an almost magical appearance. Perfect for romantic occasions or adding a touch of enchantment to everyday spaces.",
    "Eternal Sunshine Bouquet":
      "☀️ Eternal Sunshine Bouquet – Bright and cheerful yellow blooms that bring warmth and joy to any space. This vibrant arrangement is designed to evoke feelings of happiness and optimism with its sunny palette. Ideal for celebrations, congratulations, or simply brightening someone's day with a burst of sunshine.",
    "Barbie Blush Daisy Bouquet":
      "💖 Barbie Blush Daisy Bouquet – A playful and feminine bouquet featuring blush-hued daisies, inspired by Barbie's signature charm. This whimsical arrangement combines the innocence of daisies with the iconic pink tones associated with the beloved doll. Perfect for birthdays, girl power celebrations, or adding a touch of fun femininity to any space.",
    "Lavender Elegance Tulip Bouquet":
      "💜 Lavender Elegance Tulip Bouquet – Elegant lavender tulips arranged to perfection, exuding sophistication and grace. This refined arrangement showcases the timeless beauty of tulips in soothing lavender hues. Ideal for those who appreciate understated luxury and classic floral design.",
    "Crimson Charm Daisy Bouquet":
      "❤️ Crimson Charm Daisy Bouquet (Medium) – A vibrant mix of bold red daisies, radiating passion and charm. This medium-sized arrangement makes a striking statement with its rich crimson blooms. Perfect for expressing deep emotions or adding a dramatic touch to home decor.",
    "Cherry Blossom Delight Daisy Bouquet":
      "🌸 Cherry Blossom Delight Daisy Bouquet (Large) – A larger-than-life arrangement bursting with the beauty of cherry blossoms and daisies. This generous bouquet combines the delicate charm of cherry blossoms with the cheerful simplicity of daisies for a truly delightful visual experience. Ideal for making a big impression at special events or as a luxurious gift.",
    "Verdant Whimsy Wrapped Bouquet":
      "🌿 Verdant Whimsy Wrapped Bouquet – A lush, garden-fresh bouquet wrapped with love and care for a whimsical touch. This arrangement celebrates the beauty of greenery with playful accents and a unique wrapping style. Perfect for nature lovers or adding a touch of garden-inspired whimsy to any space.",
    "Rosé Romance Bloom Bouquet":
      "🌹 Rosé Romance Bloom Bouquet – A romantic selection of pink and red blooms, perfect for expressing love and admiration. This elegant arrangement combines various shades of pink and red flowers to create a bouquet that speaks the language of romance. Ideal for anniversaries, Valentine's Day, or any occasion when you want to convey deep affection and appreciation.",
  }

  // Use event delegation for product detail buttons with improved targeting
  document.addEventListener("click", (e) => {
    // First check if we clicked on a product-details-btn or its child
    const detailsBtn = e.target.classList.contains("product-details-btn")
      ? e.target
      : e.target.closest(".product-details-btn")

    if (detailsBtn) {
      e.preventDefault()
      e.stopPropagation()

      // Get product info from the card
      const card = detailsBtn.closest(".product-card")
      if (!card) {
        console.log("No product card found")
        return
      }

      const title = card.querySelector("h4").textContent
      const price = card.querySelector(".product-price").textContent
      const image = card.querySelector(".product-image img").src
      const rating = card.querySelector(".product-rating").innerHTML

      console.log(`Opening modal for: ${title}`)

      // Get description from our map or use a default
      let description = productDescriptions[title] || ""

      // Add additional details if needed
      if (!description) {
        // Create generic description based on title
        description = `This ${title} features hand-crafted premium quality materials with attention to detail. 
                       Each bouquet is uniquely designed to bring elegance to any space or occasion.
                       Our bouquets use only the finest materials to ensure a beautiful, long-lasting arrangement.
                       
                       Perfect for birthdays, anniversaries, or simply brightening someone's day!
                       
                       • Handmade with premium materials
                       • Artistically arranged for maximum visual impact
                       • Long-lasting beauty
                       • Comes in a protective packaging`
      }

      const productModal = document.getElementById("productModal")
      if (!productModal) {
        console.error("Product modal not found")
        return
      }

      // Set modal content
      document.getElementById("modal-product-title").textContent = title
      document.getElementById("modal-product-price").textContent = price
      document.getElementById("modal-product-image").src = image
      document.getElementById("modal-product-image").alt = title
      document.getElementById("modal-product-rating").innerHTML = rating
      document.getElementById("modal-product-description").textContent = description

      // Show modal with animation
      productModal.style.display = "block"
      productModal.classList.add("active")
      document.body.style.overflow = "hidden"

      return // Important: prevent other handlers from executing
    }

    // Close modal button
    if (e.target.classList.contains("close-modal") || e.target.closest(".close-modal")) {
      closeProductModal()
    }
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const productModal = document.getElementById("productModal")
    if (e.target === productModal) {
      closeProductModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("productModal").classList.contains("active")) {
      closeProductModal()
    }
  })
}

// Close product modal with animation
function closeProductModal() {
  const productModal = document.getElementById("productModal")
  if (!productModal) return

  productModal.classList.remove("active")

  // Wait for animation to complete before hiding
  setTimeout(() => {
    productModal.style.display = "none"
    document.body.style.overflow = "auto"
  }, 300)
}

// ==========================================
// UTILITIES - FIXED
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")

      if (targetId === "#") return

      e.preventDefault()

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

function initLocationSteps() {
  const locationSteps = document.querySelectorAll(".location-step")
  if (locationSteps.length) {
    locationSteps.forEach((step) => {
      step.addEventListener("click", function () {
        locationSteps.forEach((s) => s.classList.remove("active"))
        this.classList.add("active")
      })
    })

    // Copy address functionality with event delegation
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("copy-link") || e.target.closest(".copy-link")) {
        e.preventDefault()

        const link = e.target.classList.contains("copy-link") ? e.target : e.target.closest(".copy-link")

        // Get text to copy from data attribute or previous element
        const textToCopy = link.dataset.copy || link.previousElementSibling.textContent

        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // Show copied feedback
            const originalIcon = link.innerHTML
            link.innerHTML = '<i class="fas fa-check"></i>'
            setTimeout(() => {
              link.innerHTML = originalIcon
            }, 1500)

            showNotification("Copied to clipboard!", 1500)
          })
          .catch((err) => {
            console.error("Could not copy text: ", err)
            showNotification("Failed to copy to clipboard", 1500, null, "error")
          })
      }
    })
  }
}

function initFormValidation() {
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Basic validation
      const name = this.querySelector('input[name="name"]').value.trim()
      const email = this.querySelector('input[name="email"]').value.trim()
      const subject = this.querySelector('input[name="subject"]').value.trim()
      const message = this.querySelector('textarea[name="message"]').value.trim()

      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all required fields.", 3000, null, "error")
        return
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(email)) {
        showNotification("Please enter a valid email address.", 3000, null, "error")
        return
      }

      // Simulated form submission
      showNotification("Thank you for your message! We will get back to you soon.", 3000, () => {
        contactForm.reset()
      })
    })
  }
}

function initTestimonials() {
  // Auto-rotate testimonials
  const testimonialCards = document.querySelectorAll(".testimonial-card")
  if (testimonialCards.length > 1) {
    let currentIndex = 0

    // Apply initial highlight to first testimonial
    testimonialCards[0].classList.add("highlighted")

    // Set interval for rotation
    setInterval(() => {
      // Remove highlight from current testimonial
      testimonialCards[currentIndex].classList.remove("highlighted")

      // Move to next testimonial
      currentIndex = (currentIndex + 1) % testimonialCards.length

      // Add highlight to new current testimonial
      testimonialCards[currentIndex].classList.add("highlighted")
    }, 5000)
  }
}

function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop")

  if (backToTopBtn) {
    // Show button when scrolling down
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible")
      } else {
        backToTopBtn.classList.remove("visible")
      }
    })

    // Scroll to top when clicked
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

// ==========================================
// NOTIFICATIONS - FIXED
// ==========================================
function showNotification(message, duration = 3000, callback = null, type = "success") {
  // Get notification container
  let notificationContainer = document.getElementById("notificationContainer")

  // Create container if it doesn't exist
  if (!notificationContainer) {
    notificationContainer = document.createElement("div")
    notificationContainer.id = "notificationContainer"
    notificationContainer.className = "notification-container"
    document.body.appendChild(notificationContainer)
  }

  // Create notification
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  // Add icon based on type
  let icon = ""
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>'
      break
    case "error":
      icon = '<i class="fas fa-exclamation-circle"></i>'
      break
    case "info":
      icon = '<i class="fas fa-info-circle"></i>'
      break
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>'
      break
  }

  notification.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-message">${message}</div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `

  // Add close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    closeNotification(notification)
  })

  // Add to container
  notificationContainer.appendChild(notification)

  // Trigger animation
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
    notification.style.opacity = "1"
  }, 10)

  // Auto close after duration
  const timeout = setTimeout(() => {
    closeNotification(notification)

    // Run callback if provided
    if (callback) {
      callback()
    }
  }, duration)

  // Store timeout in notification
  notification.dataset.timeout = timeout
}

function closeNotification(notification) {
  // Clear timeout
  clearTimeout(notification.dataset.timeout)

  // Animate out
  notification.style.transform = "translateX(100%)"
  notification.style.opacity = "0"

  // Remove after animation
  setTimeout(() => {
    notification.remove()
  }, 300)
}

// ==========================================
// ANIMATIONS - FIXED
// ==========================================
function initAnimations() {
  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".about-values .value-item, .featured-item, .section-header, .about-content, .about-image",
    )

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top
      const screenPosition = window.innerHeight / 1.2

      if (elementPosition < screenPosition) {
        element.classList.add("animated")
      }
    })
  }

  // Run on initial load
  animateOnScroll()

  // Run on scroll
  window.addEventListener("scroll", animateOnScroll)
}

// ==========================================
// FEATURED ITEMS INTERACTIONS - FIXED
// ==========================================
function initFeaturedItems() {
  // Use event delegation for featured items
  document.addEventListener("click", (e) => {
    const featuredItem = e.target.closest(".featured-item")
    // Make sure we're not clicking on a button inside the featured item
    if (
      featuredItem &&
      !e.target.closest(".buy-btn") &&
      !e.target.closest(".cart-btn") &&
      !e.target.closest(".product-details-btn")
    ) {
      const title = featuredItem.querySelector("h3").textContent
      const price = featuredItem.querySelector("p").textContent
      const image = featuredItem.querySelector("img").src

      // Get product description from our map
      const productDescriptions = {
        "Cherry Blossom Bouquet":
          "🌸 Cherry Blossom Bouquet – A delicate arrangement of soft pink cherry blossoms, embodying the essence of spring and renewal. Each bloom is carefully selected and arranged to create a stunning visual display that brings the beauty of cherry blossoms into any space.",
        "Blue Berry Blossom Bouquet":
          "🫐 Blue Berry Blossom Bouquet – A striking mix of blue and purple blooms, evoking the richness of a berry-filled garden. This unique arrangement combines various shades of blue and purple flowers to create a cool, calming aesthetic that stands out from traditional bouquets.",
        "Blossom Symphony Bouquet":
          "🎶 Blossom Symphony Bouquet – A harmonious blend of vibrant seasonal flowers, designed to create a mesmerizing floral masterpiece. This premium arrangement features a carefully orchestrated combination of colors and textures that work together like notes in a beautiful symphony.",
        "Emerald Serenity Bouquet":
          "💚 Emerald Serenity Bouquet – Lush green accents complement serene blooms, offering a refreshing and tranquil touch. This bouquet brings the peaceful essence of a garden into any space with its focus on verdant foliage and calming flower selections.",
      }

      // Create product description
      const description =
        productDescriptions[title] ||
        `This ${title} features hand-crafted premium quality materials with attention to detail. 
         Each bouquet is uniquely designed to bring elegance to any space or occasion.
         Our bouquets use only the finest materials to ensure a beautiful, long-lasting arrangement.
         
         Perfect for birthdays, anniversaries, or simply brightening someone's day!
         
         • Handmade with premium materials
         • Artistically arranged for maximum visual impact
         • Long-lasting beauty
         • Comes in a protective packaging`

      // Get product modal
      const productModal = document.getElementById("productModal")

      if (productModal) {
        // Set modal content
        document.getElementById("modal-product-title").textContent = title
        document.getElementById("modal-product-price").textContent = price
        document.getElementById("modal-product-image").src = image
        document.getElementById("modal-product-image").alt = title

        // Create rating
        const ratingHTML = `
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star-half-alt"></i>
          <span>(4.7)</span>
        `
        document.getElementById("modal-product-rating").innerHTML = ratingHTML

        document.getElementById("modal-product-description").textContent = description

        // Show modal with animation
        productModal.style.display = "block"
        productModal.classList.add("active")
        document.body.style.overflow = "hidden"
      }
    }
  })
}

// Initialize cart on window load to ensure all elements are ready
window.addEventListener("load", () => {
  console.log("Window fully loaded, reinitializing cart...")

  // Reinitialize critical components
  initCart()

  // Make sure the cart counter is updated
  const cart = JSON.parse(localStorage.getItem("dcreativeCart")) || []
  updateCartCounter(cart.length)
})
<template>
  <footer class="bg-black border-t border-orange-500/10 py-12 mt-20" role="contentinfo">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <h3 class="text-orange-500 font-bold text-xl mb-4">
            <span class="text-orange-500">Video</span><span class="text-white">Vision</span>
          </h3>
          <p class="text-gray-400 text-sm">
            Your premium destination for streaming entertainment.
          </p>
        </div>

        <!-- Links Column 1 -->
        <div>
          <h4 class="text-white font-semibold mb-4">Company</h4>
          <ul class="space-y-2">
            <li>
              <a href="#about" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#careers" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#press" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Press
              </a>
            </li>
          </ul>
        </div>

        <!-- Links Column 2 -->
        <div>
          <h4 class="text-white font-semibold mb-4">Support</h4>
          <ul class="space-y-2">
            <li>
              <a href="#help" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#contact" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#faq" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <!-- Links Column 3 -->
        <div>
          <h4 class="text-white font-semibold mb-4">Legal</h4>
          <ul class="space-y-2">
            <li>
              <a href="#privacy" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#cookies" class="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Cookie Settings
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Social Links -->
      <div class="flex justify-center gap-6 mb-8 pb-8 border-b border-orange-500/10">
        <a 
          href="#facebook" 
          class="text-gray-400 hover:text-orange-500 transition-colors" 
          aria-label="Follow us on Facebook"
        >
          <UIcon name="i-heroicons-globe-alt" class="w-6 h-6" />
        </a>
        <a 
          href="#twitter" 
          class="text-gray-400 hover:text-orange-500 transition-colors" 
          aria-label="Follow us on Twitter"
        >
          <UIcon name="i-heroicons-at-symbol" class="w-6 h-6" />
        </a>
        <a 
          href="#instagram" 
          class="text-gray-400 hover:text-orange-500 transition-colors" 
          aria-label="Follow us on Instagram"
        >
          <UIcon name="i-heroicons-camera" class="w-6 h-6" />
        </a>
        <a 
          href="#youtube" 
          class="text-gray-400 hover:text-orange-500 transition-colors" 
          aria-label="Subscribe to our YouTube channel"
        >
          <UIcon name="i-heroicons-play-circle" class="w-6 h-6" />
        </a>
      </div>

      <!-- Copyright -->
      <div class="text-center text-gray-500 text-sm">
        <p>&copy; {{ currentYear }} VideoVision. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

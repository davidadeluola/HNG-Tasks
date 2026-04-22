import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-(--ui-surface) border-t-2 border-(--ui-border) pt-16 pb-8 px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <div className="space-y-4">
            <h2 className="typo-heading-l text-(--color-primary) font-black tracking-tight">
              Tiny Invoice
            </h2>
            <p className="typo-body text-(--ui-muted) max-w-xs">
              The simplest way to get paid. Built for modern freelancers and ambitious teams.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" aria-label="Follow Tiny Invoice on Twitter" className="text-(--ui-muted) hover:text-(--color-primary) transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Visit Tiny Invoice on GitHub" className="text-(--ui-muted) hover:text-(--color-primary) transition-colors">
                <Github size={20} />
              </a>
              <a href="#" aria-label="Connect with Tiny Invoice on LinkedIn" className="text-(--ui-muted) hover:text-(--color-primary) transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="typo-heading-s text-(--ui-text) mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Features</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Pricing</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Integrations</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="typo-heading-s text-(--ui-text) mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">About Us</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Careers</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Blog</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="typo-heading-s text-(--ui-text) mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Terms of Service</a></li>
              <li><a href="#" className="typo-body text-(--ui-muted) hover:text-(--color-primary) transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-(--ui-border) pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="typo-body-variant text-(--ui-muted)">
            &copy; {new Date().getFullYear()} Tiny Invoice Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-(--ui-muted) text-sm font-semibold bg-(--ui-bg) px-4 py-2 rounded-full border border-(--ui-border)">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

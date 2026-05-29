"use client";

import { Search, Filter, RefreshCw } from "lucide-react";

interface SidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  pricingModels: { label: string; value: string }[];
  selectedPricingModel: string;
  setSelectedPricingModel: (model: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onReset: () => void;
}

export default function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  pricingModels,
  selectedPricingModel,
  setSelectedPricingModel,
  searchQuery,
  setSearchQuery,
  onReset,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-card border border-border rounded-xl p-6 shadow-sm self-start">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <Filter size={18} className="text-primary" />
          <span>Filters</span>
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-primary flex items-center space-x-1 transition-colors"
          title="Reset all filters"
        >
          <RefreshCw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Search Platforms
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-muted-foreground" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Category
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedCategory === "all"
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Models */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Pricing Model
        </label>
        <div className="space-y-1.5">
          {pricingModels.map((model) => (
            <button
              key={model.value}
              onClick={() => setSelectedPricingModel(model.value)}
              className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedPricingModel === model.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {model.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

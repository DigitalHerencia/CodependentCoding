import { PageHero } from "@/components/blocks/page-hero"
import { LocationSearchFeature } from "@/features/maps/location-search-feature"
import { getSavedLocations } from "@/lib/fetchers/capabilityFetchers"

export async function MapFeature() {
  const saved = await getSavedLocations()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Maps"
        title="Search and retain useful locations."
        description="Mapbox owns geocoding; product authorization and persisted locations remain application-owned."
      />
      <LocationSearchFeature />
      <section>
        <h2 className="mb-4 text-2xl">Saved locations</h2>
        <ul className="grid gap-2">
          {saved.map((location) => (
            <li key={location.id} className="border bg-card p-4">
              {location.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

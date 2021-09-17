import { GlobeIcon, CloudIcon, TagIcon } from "@heroicons/react/outline";

const features = [
  {
    name: "Fully Decentralized",
    description:
      "Built using Skynet for decentralized storage and MySky for decentralized login, you are in full control, and your Homescreen moves with you from device to device.",
    icon: GlobeIcon,
  },
  {
    name: "Version Control",
    description:
      "Homescreen retains every copy your saved applications, so you can always return to past version if needed.",
    icon: TagIcon,
  },
  {
    name: "Decentralized Updates",
    description:
      "Homescreen checks to see if a developer has released new code and will download it to your personal cloud.",
    icon: CloudIcon,
  },
];

export default function FeatureSection() {
  return (
    <div className="py-12 bg-white">
      <div className="md:max-w-xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Merits of Homescreen.</h2>
        <dl className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {features.map((feature) => (
            <div key={feature.name}>
              <dt className="flex items-center space-x-4 lg:space-x-0 lg:block lg:space-y-5">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-lg leading-6 font-medium text-palette-600">{feature.name}</p>
              </dt>
              <dd className="mt-2 text-base text-palette-400 font-content">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

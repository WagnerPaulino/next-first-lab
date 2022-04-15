import { createClient, createPreviewSubscriptionHook } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import createImageUrlBuilder from '@sanity/image-url';

const config = {
    projectId: "oyy2rxwx",
    dataset: "production",
    apiVersion: "2021-03-25",//2021-10-21
    useCdn: false
};

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const portableText = (props) => <PortableText components={{}} {...props} />

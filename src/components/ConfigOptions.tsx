import {
  Link,
} from '@chakra-ui/react';
import React from 'react';

import ReactMarkdown from 'react-markdown';

import configSchema from '../content/mergify-configuration-openapi.json';

import { mdxComponents } from './Page';

// FIXME: move this to JSON schema?
const valueTypeLinks: { [key: string]: string } = {
  '/definition/TemplateArray': '/configuration/data-types#template',
  '/definition/UserArray': '/configuration/data-types#template',
  '/definition/Template': '/configuration/data-types#template',
  '/definition/LabelArray': '/configuration/data-types#template',
  '/definition/TimestampOrRelativeTimestamp': '/configuration/data-types#timestamp',
  '/definition/RuleCondition': '/configuration/conditions',
  '/definition/Duration': '/configuration/data-types#duration',
  '/definition/PriorityRule': '/merge-queue/priority#how-to-define-priority-rules',
};

export interface OptionDefinition {
  valueType: string;
  description: string;
  default: string | boolean;
  $ref: any;
}

export function getTypeLink(ref: string): string | undefined {
  if (ref) {
    const refPath = ref.split('/').slice(1);
    const refDefinition = refPath.reduce((acc, segment) => (acc as any)[segment], configSchema);
    const refId = refDefinition.$id;

    return valueTypeLinks[refId];
  }

  return undefined;
}

function getTypeDescription(ref: string): string {
  if (ref) {
    const refPath = ref.split('/').slice(1);
    const refDefinition = refPath.reduce((acc, segment) => (acc as any)[segment], configSchema);
    return refDefinition.description;
  }

  return '?';
}

export function getValueType(definition): string {
  let valueType = null;

  if (definition.type === 'array') {
    const typeLink = getTypeLink(definition.items.$ref);
    const typeDescription = (
      <ReactMarkdown components={mdxComponents as any}>
        {getTypeDescription(definition.items.$ref)}
      </ReactMarkdown>
    );

    if (typeLink !== undefined) {
      valueType = (
        <>list of
          <Link color="primary" textDecoration="underline" href={typeLink}>
            {typeDescription}
          </Link>
        </>
      );
    } else valueType = <>list of {typeDescription}</>;
  } else if (definition.$ref !== undefined) {
    const typeLink = getTypeLink(definition.$ref);
    const typeDescription = (
      <ReactMarkdown components={mdxComponents as any}>
        {getTypeDescription(definition.$ref)}
      </ReactMarkdown>
    );

    if (typeLink !== undefined) {
      valueType = (
        <Link color="primary" textDecoration="underline" href={typeLink}>
          {typeDescription}
        </Link>
      );
    } else valueType = typeDescription;
  } else {
    valueType = definition.type;
  }

  return valueType;
}
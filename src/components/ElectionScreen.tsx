import React, { useState, useEffect } from 'react'
import {
  Card,
  AnchorButton,
  RadioGroup,
  Radio,
  HTMLSelect,
  Callout,
  ButtonGroup,
  Button,
  Intent
} from '@blueprintjs/core'
import { useHistory, useLocation, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { ErrorLabel } from './Atoms/Form/_helpers'
import { Formik, FormikProps, Field } from 'formik'
import LinkButton from './Atoms/LinkButton'
import FormSection from './Atoms/Form/FormSection'
import FormButton from './Atoms/Form/FormButton'
import { Wrapper, Inner } from './Atoms/Wrapper'
import FormField from './Atoms/Form/FormField'
import { time } from 'console'

const activeElections = [
  {
    id: 0,
    electionName: 'Election 1',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'CST',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null
  },
  {
    id: 1,
    electionName: 'Sample Election 2',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'UTC',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null
  },
  {
    id: 2,
    electionName: 'Sample 3',
    electionDate: new Date(),
    pollsOpen: new Date().getHours()+':'+new Date().getMinutes(),
    pollsClose: (new Date().getHours()+3)+':'+new Date().getMinutes(),
    timezone: 'IST',
    certificationDate: new Date(),
    participatingJursidiction: null,
    electionDefinition: null
  }
];

const CreateElectionWrapper = styled.div`
  background-color: #ebf1f5;
  padding: 30px;
`

const ActiveElectionsWrapper = styled.div`
  padding: 30px;
`

const WideField = styled(FormField)`
  width: 100%;
`

const Select = styled(HTMLSelect)`
  margin-top: 5px;
`

interface IValues {
  electionName: string
  electionDate: Date | null,
  pollsOpen: TimeRanges | null,
  pollsClose: TimeRanges | null,
  timezone: string,
  certificationDate: Date | null,
  participatingJurisdictions: File | null,
  electionDefinition: File | null
}

const CreateElection: React.FC = () => {
  return (
    <Formik
      onSubmit={() => console.log('submitted')}
      initialValues={{
        electionName: '',
        electionDate: null,
        pollsOpen: null,
        pollsClose: null,
        timezone: '',
        certificationDate: null,
        participatingJurisdictions: null,
        electionDefinition: null
      }}
    >
      {({ setFieldValue, setValues, values }: FormikProps<IValues>) => (
        <CreateElectionWrapper>
          <h2>Create New Election</h2>
          <FormSection>
            <label htmlFor="electionName">
              <p>Election name</p>
              <Field
                id="electionName"
                name="electionName"
                type="text"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="electionDate">
              <p>Election date</p>
              <Field
                id="electionDate"
                name="electionDate"
                type="date"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="pollsOpen">
              <p>Polls open</p>
              <Field
                id="pollsOpen"
                name="pollsOpen"
                type="time"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="pollsClose">
              <p>Polls close</p>
              <Field
                id="pollsClose"
                name="pollsClose"
                type="time"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="timezone">
              <p>Timezone</p>
              <Field
                id="timezone"
                name="timezone"
                type="text"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="certificationDate">
              <p>Certification Date</p>
              <Field
                id="certificationDate"
                name="certificationDate"
                type="date"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          {/* <FormSection>
            <label htmlFor="participatingJurisdictions">
              <p>Participating Jurisdictions</p>
              <Field
                id="participatingJurisdictions"
                name="participatingJurisdictions"
                type="file"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection>
          <FormSection>
            <label htmlFor="electionDefinition">
              <p>Election Definition</p>
              <Field
                id="electionDefinition"
                name="electionDefinition"
                type="file"
                // disabled={submitting}
                validate={(v: string) => (v ? undefined : 'Required')}
                component={WideField}
              />
            </label>
          </FormSection> */}
          <FormButton
            type="button"
            intent="primary"
            fill
            large
            // onClick={handleSubmit}
            // loading={submitting}
          >
            Create new election
         </FormButton>
        </CreateElectionWrapper>
      )}
    </Formik>

  )
}

const ActiveElections = () => {
  return (
    <ActiveElectionsWrapper>
      <h2>Active Elections</h2>
      { activeElections.length === 0 ? (
         <p>You haven&apos;t created any elections yet</p>
        ) : (
          activeElections.map(elec => (
            <ButtonGroup
                key={elec.id}
                fill
                large
                style={{ marginBottom: '15px' }}
            >
              <LinkButton
                style={{ justifyContent: 'start' }}
                to={`/election/${elec.id}`}
                intent="primary"
                fill
              >{elec.electionName}</LinkButton>
            </ButtonGroup>
          ))
        //   sortBy(activeElections, e => e.electionName).map(election => (
        //   <LinkButton
        //     key={election.id}
        //     style={{ justifyContent: 'start' }}
        //     to={`/election/${election.id}`}
        //     intent="primary"
        //     fill
        //   >
        //     {election.auditName}
        //   </LinkButton>
        // ))
      )}
    </ActiveElectionsWrapper>
  );
}

const ElectionScreen: React.FC = () => {
  return (
    <Wrapper>
      <Inner>
        <div style={{ width: '50%' }}>
          <CreateElection />
        </div>
        <div style={{ width: '50%' }}>
          <ActiveElections />
        </div>
      </Inner>
    </Wrapper>
  )
}

export default ElectionScreen


{/* <CreateElectionWrapper></CreateElectionWrapper>
<ActiveElectionsWrapper></ActiveElectionsWrapper> */}

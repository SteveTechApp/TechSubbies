# Inclusive profile preferences

P2.4 adds work preferences and alternative evidence routes without turning accessibility information into a ranking signal.

## Engineer-controlled profile data

Engineers can record:

- preferred work modes: on-site, remote and/or hybrid
- working languages
- practical accessibility adjustments
- alternative evidence routes they can provide

Supported alternative evidence routes are:

- supervisor reference
- client reference
- portfolio / project examples
- work sample
- practical assessment
- manufacturer training
- peer validation

Declaring an evidence route does not verify it and does not increase a skill score. The underlying reference, sample or assessment must still pass through the relevant TechSubbies trust/evidence workflow before it can be treated as verified evidence.

## Accessibility privacy boundary

Accessibility information is private by default.

The engineer does not need to disclose a diagnosis. The profile asks only for practical work/site adjustments such as step-free access, seated work, reduced manual handling, additional breaks or written task instructions.

A separate `shareWithCompanies` choice is required before practical accessibility details can enter marketplace/directory data.

Even when shared:

- accessibility details are for booking/site planning
- they are not available as Find Talent filters
- they are not included in match scoring
- they are not used to rank engineers

The directory projection also strips earlier experimental top-level accessibility fields so they cannot bypass the explicit sharing gate.

## Work-mode and language matching

Companies may filter on work mode and language because these are work-relevant preferences chosen by the engineer.

Legacy engineers who have never saved inclusive preferences are **not** silently treated as English-speaking/on-site workers. The engineer form may start with convenient defaults, but a specific company filter matches only an explicitly saved declaration.

The same work-mode/language constraint is applied before AI Smart Match so AI refinement cannot reintroduce candidates that do not match the selected preference.

## Company visibility

The applicant deep-dive view shows:

- declared work modes
- declared languages
- declared alternative evidence routes with a clear "not verified proof" warning
- accessibility details only where the engineer explicitly opted to share them

If an engineer has never set these preferences, the company sees that they are not declared rather than inferred defaults.

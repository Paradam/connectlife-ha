"""Helpers for evaluating data-dictionary conditions against device state."""

from collections.abc import Mapping

type ConditionValue = int | list[int]
type ConditionGroup = dict[str, ConditionValue]
type Conditions = ConditionGroup | list[ConditionGroup]


def _condition_group_matches(
    status_list: Mapping[str, object], conditions: ConditionGroup
) -> bool:
    """Return whether every condition in one AND group matches."""
    for name, expected in conditions.items():
        actual = status_list.get(name)
        if isinstance(expected, list):
            if actual not in expected:
                return False
        elif actual != expected:
            return False
    return True


def conditions_match(status_list: Mapping[str, object], conditions: Conditions) -> bool:
    """Return whether the configured runtime conditions match device state.

    A dictionary is one AND group: every property must match. A list of
    dictionaries is an OR expression: at least one AND group must match.
    Within a group, a list-valued expectation means the current value may
    match any value in that list.
    """
    if isinstance(conditions, list):
        return any(_condition_group_matches(status_list, group) for group in conditions)
    return _condition_group_matches(status_list, conditions)

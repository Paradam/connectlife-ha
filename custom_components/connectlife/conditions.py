"""Helpers for evaluating data-dictionary conditions against device state."""

from collections.abc import Mapping

type ConditionValue = int | list[int]
type Conditions = dict[str, ConditionValue]


def conditions_match(status_list: Mapping[str, object], conditions: Conditions) -> bool:
    """Return whether all configured conditions match the current status.

    A scalar expected value requires an exact match. A list means the current
    value may match any value in the list. Different property entries are ANDed.
    """
    for name, expected in conditions.items():
        actual = status_list.get(name)
        if isinstance(expected, list):
            if actual not in expected:
                return False
        elif actual != expected:
            return False
    return True
